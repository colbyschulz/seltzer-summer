export const baseUrl =
  process.env.ENVIRONMENT === 'prod'
    ? 'https://api.airtable.com/v0/appusTcSy172j3GYs/prod'
    : 'http://localhost:3000/api';

export const queryKeys = {
  races: 'races',
  users: 'users',
  race: 'race',
};
