const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Crear estudiante
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener estudiantes por profesor
router.get('/:teacherId', async (req, res) => {
  try {
    const students = await Student.find({ teacherId: req.params.teacherId });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
