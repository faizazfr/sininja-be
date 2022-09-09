import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const Users = db.define(
  'users',
  {
    nama: DataTypes.STRING,
    produk: DataTypes.STRING,
    tujuan: DataTypes.STRING,
    tarif: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

export default Users;

(async () => {
  await db.sync();
})();
