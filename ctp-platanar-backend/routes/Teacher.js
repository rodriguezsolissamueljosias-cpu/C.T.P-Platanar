const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

// Crear profesor
router.post('/', async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar profesores
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
