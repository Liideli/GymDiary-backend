import {Application} from 'express';
import request from 'supertest';
import {GroupTest} from '../src/types/DBTypes';

const group = async (url: string | Application, id: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `
        query Group($groupId: ID!) {
          group(id: $groupId) {
            id
            name
            description
            owner {
              id
              user_name
              email
              workoutCount
            }
            members {
              id
              user_name
              email
              workoutCount
            }
          }
        }`,
        variables: {
          groupId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const group = response.body.data.group;
          expect(group).toHaveProperty('id');
          expect(group).toHaveProperty('name');
          expect(group).toHaveProperty('description');
          expect(group).toHaveProperty('owner');
          expect(group).toHaveProperty('members');
          resolve(group);
        }
      });
  });
};

const groups = async (url: string | Application) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `
        query Groups {
          groups {
            id
            name
            description
            owner {
              user_name
              email
              workoutCount
            }
            members {
              id
              user_name
              email
              workoutCount
            }
          }
        }`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.body.data.groups);
        }
      });
  });
};

const createGroup = async (url: string | Application, group: GroupTest) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `
        mutation CreateGroup($input: GroupInput!) {
          createGroup(input: $input) {
            group {
              id
              name
              description
              owner {
                id
                user_name
                email
                workoutCount
              }
              members {
                id
                user_name
                email
                workoutCount
              }
            }
            message
          }
        }`,
        variables: {
          input: group,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.body.data.createGroup.group);
        }
      });
  });
};

const deleteGroup = async (url: string | Application, id: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `
        mutation DeleteGroup($deleteGroupId: ID!) {
          deleteGroup(id: $deleteGroupId) {
            group {
              id
              name
              description
              owner {
                id
                user_name
                email
                workoutCount
              }
              members {
                id
                user_name
                email
                workoutCount
              }
            }
            message
          }
        }`,
        variables: {
          deleteGroupId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.body.data.deleteGroup.group);
        }
      });
  });
};
const joinGroup = async (url: string | Application, groupId: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `
          mutation JoinGroup($joinGroupId: ID!) {
            joinGroup(id: $joinGroupId) {
              group {
                id
                name
                description
                owner {
                  id
                  user_name
                  email
                  workoutCount
                }
                members {
                  id
                  user_name
                  email
                  workoutCount
                }
              }
              message
            }
          }`,
        variables: {
          joinGroupId: groupId,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.body.data.joinGroup.group);
        }
      });
  });
};

export {group, groups, createGroup, deleteGroup, joinGroup};
