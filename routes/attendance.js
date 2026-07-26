const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Crear registro de asistencia
router.post('/', async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todos los registros de asistencia
router.get('/', async (req, res) => {
  try {
    const attendances = await Attendance.findAll();
    res.json(attendances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar asistencia por ID
router.put('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) return res.status(404).json({ error: 'Asistencia no encontrada' });
    await attendance.update(req.body);
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
