const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Crear estudiante
router.post('/', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener estudiantes por profesor
router.get('/:teacherId', async (req, res) => {
  try {
    const students = await Student.findAll({ where: { teacherId: req.params.teacherId } });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar todos los estudiantes
router.delete('/', async (req, res) => {
  try {
    await Student.destroy({ where: {} });
    res.json({ message: 'Todos los estudiantes eliminados' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
