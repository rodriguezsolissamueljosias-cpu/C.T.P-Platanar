// server.js - Backend principal con MongoDB
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();

// Conectar a MongoDB
connectDB();

const allowedOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Rutas API
app.use('/api/teachers', require('./routes/Teacher'));
app.use('/api/students', require('./routes/Student'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/grades', require('./routes/Grade'));
app.use('/api/sections', require('./routes/Section'));
app.use('/api/parents', require('./routes/parents'));

// Ruta de verificación (health check)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});

module.exports = app;
