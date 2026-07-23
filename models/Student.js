const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Student = sequelize.define('Student', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  grade: { type: DataTypes.STRING },
  section: { type: DataTypes.STRING },
  parentEmail: { type: DataTypes.STRING },
  teacherId: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'Students' });

module.exports = Student;
