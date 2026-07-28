const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { requireAuth } = require('../middleware/auth');

// Crear registro de asistencia
router.post('/', requireAuth, async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todos los registros
router.get('/', requireAuth, async (req, res) => {
  try {
    const records = await Attendance.find();
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar asistencia
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updated = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Registro no encontrado' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
