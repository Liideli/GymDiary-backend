import {Application} from 'express';
import request from 'supertest';
import {WorkoutTest} from '../src/types/DBTypes';

const workoutsByUser = async (url: string | Application, owner: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `
        query Workouts($owner: String!) {
          workouts(owner: $owner) {
            id
            title
            description
            date
            owner {
              id
              user_name
              email
            }
          }
        }`,
        variables: {
          owner,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const workouts = response.body.data.workouts;
          expect(workouts).toBeInstanceOf(Array);
          expect(workouts[0]).toHaveProperty('id');
          expect(workouts[0]).toHaveProperty('title');
          expect(workouts[0]).toHaveProperty('description');
          expect(workouts[0]).toHaveProperty('date');
          expect(workouts[0]).toHaveProperty('owner');
          resolve(response.body.data.workouts);
        }
      });
  });
};

const workout = async (url: string | Application, id: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `
        query Workout($id: String!) {
          workout(id: $id) {
            id
            title
            description
            date
            owner {
              id
              user_name
              email
            }
          }
        }`,
        variables: {
          id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const workout = response.body.data.workout;
          expect(workout).toHaveProperty('id');
          expect(workout).toHaveProperty('title');
          expect(workout).toHaveProperty('description');
          expect(workout).toHaveProperty('date');
          expect(workout).toHaveProperty('owner');
          resolve(response.body.data.workout);
        }
      });
  });
};

const workoutsByOwner = async (url: string | Application, owner: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `
        query Workouts($owner: String!) {
          workouts(owner: $owner) {
            id
            title
            description
            date
            owner {
              id
            }
          }
          }`,
        variables: {
          owner,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const workouts = response.body.data.workouts;
          expect(workouts).toBeInstanceOf(Array);
          expect(workouts[0]).toHaveProperty('id');
          expect(workouts[0]).toHaveProperty('title');
          expect(workouts[0]).toHaveProperty('description');
          expect(workouts[0]).toHaveProperty('date');
          expect(workouts[0]).toHaveProperty('owner');
          resolve(response.body.data.workouts);
        }
      });
  });
};

const workoutBySearch = async (url: string | Application, search: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `
        query Workout($search: String!) {
          workout(search: $search) {
            id
            title
            description
            date
            owner {
              id
            }
          }
          }`,
        variables: {
          search,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const workouts = response.body.data.workout;
          expect(workouts).toBeInstanceOf(Array);
          expect(workouts[0]).toHaveProperty('id');
          expect(workouts[0]).toHaveProperty('title');
          expect(workouts[0]).toHaveProperty('description');
          expect(workouts[0]).toHaveProperty('date');
          expect(workouts[0]).toHaveProperty('owner');
          resolve(response.body.data.workout);
        }
      });
  });
};

const createWorkout = async (
  url: string | Application,
  workout: WorkoutTest,
): Promise<WorkoutTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `
        mutation CreateWorkout($workout: WorkoutInput!) {
          createWorkout(workout: $workout) {
            workout {
              id
              title
              description
              date
            }
          }
          }`,
        variables: {
          workout,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const workout = response.body.data.workout;
          expect(workout).toHaveProperty('id');
          expect(workout).toHaveProperty('title');
          expect(workout).toHaveProperty('description');
          expect(workout).toHaveProperty('date');
          resolve(response.body.data.workout);
        }
      });
  });
};

const modifyWorkout = async (
  url: string | Application,
  workout: WorkoutTest,
): Promise<WorkoutTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `
        mutation ModifyWorkout($workout: WorkoutInput!) {
          modifyWorkout(workout: $workout) {
            workout {
              id
              title
              description
              date
            }
          }
          }`,
        variables: {
          workout,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const workout = response.body.data.workout;
          expect(workout).toHaveProperty('id');
          expect(workout).toHaveProperty('title');
          expect(workout).toHaveProperty('description');
          expect(workout).toHaveProperty('date');
          resolve(response.body.data.workout);
        }
      });
  });
};

const deletedWorkout = async (url: string | Application, id: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `
        mutation DeleteWorkout($id: ID!) {
          deleteWorkout(id: $id) {
            id
          }
          }`,
        variables: {
          id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const workout = response.body.data.workout;
          expect(workout).toHaveProperty('id');
          resolve(response.body.data.workout);
        }
      });
  });
};

export {
  workoutsByOwner,
  workoutsByUser,
  workout,
  workoutBySearch,
  createWorkout,
  modifyWorkout,
  deletedWorkout,
};
