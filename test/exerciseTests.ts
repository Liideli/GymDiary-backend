import {Application} from 'express';
import request from 'supertest';
import {ExerciseTest} from '../src/types/DBTypes';

const exercisesByWorkout = async (
  url: string | Application,
  workout: string,
) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `
        query ExercisesByWorkout($workout: ID!) {
          exercisesByWorkout(workout: $workout) {
            description
            duration
            id
            name
            reps
            sets
            weight
            workout
            owner
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
          const exercises = response.body.data.exercisesByWorkout;
          expect(exercises).toBeInstanceOf(Array);
          expect(exercises[0]).toHaveProperty('id');
          expect(exercises[0]).toHaveProperty('name');
          expect(exercises[0]).toHaveProperty('description');
          expect(exercises[0]).toHaveProperty('workout');
          expect(exercises[0]).toHaveProperty('sets');
          expect(exercises[0]).toHaveProperty('reps');
          expect(exercises[0]).toHaveProperty('weight');
          expect(exercises[0]).toHaveProperty('duration');
          expect(exercises[0]).toHaveProperty('owner');
          resolve(response.body.data.exercisesByWorkout);
        }
      });
  });
};

const createExercise = async (
  url: string | Application,
  exercise: ExerciseTest,
): Promise<ExerciseTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `
        mutation CreateExercise($exercise: ExerciseInput!) {
          createExercise(exercise: $exercise) {
            exercise {
              description
              duration
              id
              name
              reps
              sets
              weight
              workout
              owner
            }
          }
        }`,
        variables: {
          exercise,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.body.data.createExercise.exercise);
        }
      });
  });
};

const modifyExercise = async (
  url: string | Application,
  exercise: ExerciseTest,
): Promise<ExerciseTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `
        mutation ModifyExercise($exercise: ExerciseInput!) {
          modifyExercise(exercise: $exercise) {
            exercise {
              description
              duration
              id
              name
              reps
              sets
              weight
              workout
              owner
            }
          }
        }`,
        variables: {
          exercise,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.body.data.modifyExercise.exercise);
        }
      });
  });
};

const deletedExercise = async (url: string | Application, id: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `
        mutation DeleteExercise($id: ID!) {
          deleteExercise(id: $id) {
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
          resolve(response.body.data.deleteExercise.id);
        }
      });
  });
};

export {exercisesByWorkout, createExercise, modifyExercise, deletedExercise};
