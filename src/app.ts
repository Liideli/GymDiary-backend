require('dotenv').config();
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import {notFound, errorHandler, authenticate} from './middlewares';
import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import typeDefs from './api/schemas/index';
import resolvers from './api/resolvers/index';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import {shield} from 'graphql-shield';
import {createRateLimitRule} from 'graphql-rate-limit';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {constraintDirectiveTypeDefs} from 'graphql-constraint-directive';
import {MyContext} from './types/MyContext';
import {applyMiddleware} from 'graphql-middleware';

const app = express();

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  }),
);

(async () => {
  try {
    const rateLimitRule = createRateLimitRule({
      identifyContext: (ctx) => {
        return ctx.userdata?._id ? ctx.userdata._id : ctx.id;
      },
    });

    const permissions = shield({
      Mutation: {
        login: rateLimitRule({max: 5, window: '10s'}),
      },
    });

    const executableSchema = makeExecutableSchema({
      typeDefs: [constraintDirectiveTypeDefs, typeDefs],
      resolvers,
    });

    const schema = applyMiddleware(executableSchema, permissions);

    const server = new ApolloServer<MyContext>({
      schema,
      introspection: true,
      plugins: [
        process.env.NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageProductionDefault({
              embed: true as false,
            })
          : ApolloServerPluginLandingPageLocalDefault(),
      ],
      includeStacktraceInErrorResponses: false,
    });

    await server.start();
    //app.use(apiKeyMiddleware);

    app.use(
      '/graphql',
      cors<cors.CorsRequest>(),
      express.json(),
      authenticate,
      expressMiddleware(server, {
        context: ({res}) => res.locals.user,
      }),
    );

    app.use(notFound);
    app.use(errorHandler);
  } catch (error) {
    console.error((error as Error).message);
  }
})();

export default app;
