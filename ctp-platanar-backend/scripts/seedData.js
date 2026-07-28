const bcrypt = require('bcryptjs');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const Section = require('../models/Section');
const Parent = require('../models/Parent');

// Asume que ya existe una conexión activa a MongoDB (ver scripts/seed.js y scripts/dev-local.js).
async function seedDatabase() {
  await Promise.all([
    Teacher.deleteMany({}),
    Student.deleteMany({}),
    Attendance.deleteMany({}),
    Grade.deleteMany({}),
    Section.deleteMany({}),
    Parent.deleteMany({})
  ]);

  await Grade.insertMany([{ name: '7mo' }, { name: '8vo' }, { name: '9no' }]);
  await Section.insertMany([{ name: '9-1' }, { name: '9-2' }]);

  const adminPassword = await bcrypt.hash('admin123', 10);
  await Teacher.create({
    firstName: 'Ana',
    lastName: 'Ramírez',
    email: 'admin@ctpplatanar.edu.cr',
    phone: '8888-0000',
    password: adminPassword,
    subject: 'Matemática',
    role: 'admin'
  });

  const teacherPassword = await bcrypt.hash('profesor123', 10);
  const teacher = await Teacher.create({
    firstName: 'Carlos',
    lastName: 'Mora',
    email: 'carlos.mora@ctpplatanar.edu.cr',
    phone: '8888-1111',
    password: teacherPassword,
    subject: 'Español',
    role: 'teacher'
  });

  const students = await Student.insertMany([
    {
      studentId: '001',
      firstName: 'Deiby',
      lastName: 'Samir',
      grade: '9no',
      section: '9-1',
      parentEmail: 'mama.deiby@example.com',
      parentPhone: '7000-1111',
      teacherId: teacher._id
    },
    {
      studentId: '002',
      firstName: 'María',
      lastName: 'Fernández',
      grade: '9no',
      section: '9-1',
      teacherId: teacher._id
    },
    {
      studentId: '003',
      firstName: 'José',
      lastName: 'Vargas',
      grade: '9no',
      section: '9-2',
      parentEmail: 'papa.jose@example.com',
      teacherId: teacher._id
    }
  ]);

  await Attendance.insertMany([
    { status: 'Presente', studentId: students[0]._id, teacherId: teacher._id },
    { status: 'Ausente', studentId: students[1]._id, teacherId: teacher._id }
  ]);

  await Parent.create({
    firstName: 'Mamá',
    lastName: 'de Deiby',
    children: [{ name: 'Deiby Samir', studentId: '001' }]
  });

  console.log('✅ Datos de prueba creados.');
  console.log('   Admin:    admin@ctpplatanar.edu.cr / admin123');
  console.log('   Profesor: carlos.mora@ctpplatanar.edu.cr / profesor123');
}

module.exports = seedDatabase;
