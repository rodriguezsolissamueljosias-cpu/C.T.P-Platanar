const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

// Registrar profesor
router.post('/', async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar profesores
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.findAll();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar todos los profesores
router.delete('/', async (req, res) => {
  try {
    await Teacher.destroy({ where: {} });
    res.json({ message: 'Todos los profesores eliminados' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
