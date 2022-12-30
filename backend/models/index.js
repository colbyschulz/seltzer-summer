import Sequelize from 'sequelize';
import config from '../config/config.js';
import raceModel from './race.model.js';
import userModel from './user.model.js';

const env = process.env.NODE_ENV || 'development';

const environmentConfig = config[env];

const db = {};

let sequelize;
if (environmentConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[environmentConfig.use_env_variable], environmentConfig);
} else {
  sequelize = new Sequelize(
    environmentConfig.database,
    environmentConfig.username,
    environmentConfig.password,
    environmentConfig,
  );
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Sequelize = Sequelize;
db.races = raceModel(sequelize);
db.users = userModel(sequelize);

db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log('Synced db.');
  })
  .catch((err) => {
    console.log('Failed to sync db: ' + err.message);
  });

export default db;
