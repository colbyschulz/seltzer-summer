export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://dvpzzyyi05.execute-api.us-east-1.amazonaws.com/api'
    : 'https://dvpzzyyi05.execute-api.us-east-1.amazonaws.com/api';

export const queryKeys = {
  races: 'races',
  users: 'users',
};
