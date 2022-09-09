import { Sequelize } from 'sequelize';

const db = new Sequelize('crut_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

export default db;
