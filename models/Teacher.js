const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Teacher = sequelize.define('Teacher', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  teacherId: { type: DataTypes.STRING, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING }, // aquí puedes usar bcrypt para encriptar
  subject: { type: DataTypes.STRING }
}, { tableName: 'Teachers' });

module.exports = Teacher;
