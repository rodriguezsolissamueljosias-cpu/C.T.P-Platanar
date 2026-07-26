// server.js - Backend principal con MongoDB Atlas
const express = require('express');
const connectDB = require('./db');
require('dotenv').config();

const app = express();

// Conectar a MongoDB Atlas
connectDB();

// Middleware para parsear JSON
app.use(express.json());

// Rutas API (asegúrate que la carpeta "routes" está en la raíz del backend)
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/students', require('./routes/students'));
app.use('/api/attendance', require('./routes/attendance'));

// Ruta de verificación (health check)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
