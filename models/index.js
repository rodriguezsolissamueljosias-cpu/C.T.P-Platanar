// ctp-platanar-backend/models/index.js
const sequelize = require('../db');
const Teacher = require('./Teacher');
const Student = require('./Student');
const Attendance = require('./Attendance');

// Relaciones entre modelos
Teacher.hasMany(Student, { foreignKey: 'teacherId' });
Student.belongsTo(Teacher, { foreignKey: 'teacherId' });

Student.hasMany(Attendance, { foreignKey: 'studentId' });
Attendance.belongsTo(Student, { foreignKey: 'studentId' });

Teacher.hasMany(Attendance, { foreignKey: 'teacherId' });
Attendance.belongsTo(Teacher, { foreignKey: 'teacherId' });

module.exports = {
  sequelize,
  Teacher,
  Student,
  Attendance
};
