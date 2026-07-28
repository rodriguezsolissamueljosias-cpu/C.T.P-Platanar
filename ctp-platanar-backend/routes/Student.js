const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const { requireAuth } = require('../middleware/auth');

// Crear estudiante
router.post('/', requireAuth, async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Resumen de padres (estudiantes con datos de contacto registrados)
// Estas rutas literales deben ir antes de /teacher/:teacherId y /:id.
router.get('/parents/overview', requireAuth, async (req, res) => {
  try {
    const students = await Student.find({
      $or: [{ parentEmail: { $ne: '' } }, { parentPhone: { $ne: '' } }]
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Quitar los datos de contacto de un padre/madre de un estudiante
router.delete('/parents/:id', requireAuth, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { parentEmail: '', parentPhone: '' },
      { new: true }
    );
    if (!student) return res.status(404).json({ message: 'Estudiante no encontrado' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener estudiantes por profesor
router.get('/teacher/:teacherId', requireAuth, async (req, res) => {
  try {
    const students = await Student.find({ teacherId: req.params.teacherId });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Marcar asistencia de hoy para un estudiante (crea o actualiza el registro del día)
router.put('/:studentId/attendance', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOneAndUpdate(
      { studentId: req.params.studentId, date: { $gte: startOfDay, $lte: endOfDay } },
      { status, studentId: req.params.studentId, date: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar todos los estudiantes
router.delete('/', requireAuth, async (req, res) => {
  try {
    await Student.deleteMany({});
    res.json({ message: 'Todos los estudiantes eliminados' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar un estudiante
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Estudiante eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
