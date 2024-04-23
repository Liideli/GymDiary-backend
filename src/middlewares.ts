import {NextFunction, Request, Response} from 'express';

import CustomError from './classes/CustomError';
import {ErrorResponse} from './types/MessageTypes';
import {UserWithoutPassword} from './types/DBTypes';
import jwt from 'jsonwebtoken';
import {MyContext} from './types/MyContext';

const API_KEY = process.env.API_KEY;

// Middleware function for API key authentication
const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];

  // If the API key is not provided or is incorrect, send a 401 Unauthorized response
  if (!apiKey || apiKey !== API_KEY) {
    res.status(401).json({message: 'Invalid API key'});
  } else {
    next();
  }
};

const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response<ErrorResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  // console.log(err);
  const statusCode = err.status !== 200 ? err.status || 500 : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!process.env.JWT_SECRET) {
      next(new CustomError('JWT secret not set', 500));
      return;
    }
    if (!authHeader) {
      res.locals.user = {};
      return next();
    }
    // using bearer token
    const token = authHeader.split(' ')[1];
    if (!token) {
      res.locals.user = {};
      return next();
    }
    const tokenContent = jwt.verify(
      token,
      process.env.JWT_SECRET,
    ) as UserWithoutPassword;
    // optionally check if the user is still in the database
    console.log('authenticating', tokenContent);
    const context: MyContext = {userdata: tokenContent};
    res.locals.user = context;
    next();
  } catch (error) {
    res.locals.user = {};
    next();
  }
};

export {notFound, errorHandler, authenticate, apiKeyMiddleware};
