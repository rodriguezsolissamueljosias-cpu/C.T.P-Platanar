const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Student = require('./Student');

const Attendance = sequelize.define('Attendance', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  status: { 
    type: DataTypes.ENUM('Presente','Tarde','Ausente','Justificado','Escapando'),
    allowNull: false 
  },
  justificationStatus: { 
    type: DataTypes.ENUM('pending','approved','rejected'),
    defaultValue: 'pending' 
  },
  studentId: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'Attendances' });

// Relación: una asistencia pertenece a un estudiante
Attendance.belongsTo(Student, { foreignKey: 'studentId' });

module.exports = Attendance;
