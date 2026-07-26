const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Crear registro de asistencia
router.post('/', async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los registros
router.get('/', async (req, res) => {
  try {
    const records = await Attendance.find().populate('studentId');
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar asistencia
router.put('/:id', async (req, res) => {
  try {
    const updated = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
