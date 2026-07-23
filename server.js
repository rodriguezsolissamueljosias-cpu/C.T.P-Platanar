const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./db');

const studentRoutes = require('./routes/Student.js');
const teacherRoutes = require('./routes/Teacher.js');
const attendanceRoutes = require('./routes/Attendance.js');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos establecida.');
    return sequelize.sync({ alter: true }); // no borra datos
  })
  .then(() => console.log('✅ Modelos sincronizados.'))
  .catch(err => console.error('❌ Error DB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend en http://localhost:${PORT}`));
