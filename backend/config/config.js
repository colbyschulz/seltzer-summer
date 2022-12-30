const { DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;

export default {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: 'summer_of_speed_development',
    host: DB_HOST,
    dialect: 'postgres',
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: 'summer_of_speed_test',
    host: DB_HOST,
    dialect: 'postgres',
  },

  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: 'summer_of_speed_production',
    host: DB_HOST,
    dialect: 'postgres',
  },
};
