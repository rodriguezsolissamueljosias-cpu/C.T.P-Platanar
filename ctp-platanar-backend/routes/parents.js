const express = require('express');
const router = express.Router();
const Parent = require('../models/Parent');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

// Auto-registro de un padre/madre en el portal (sin login: acceso por enlace + id)
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, children } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'Nombre y apellido son obligatorios' });
    }

    const validChildren = (children || []).filter((c) => c && c.name && c.studentId);
    const parent = await Parent.create({ firstName, lastName, children: validChildren });
    res.status(201).json(parent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Consultar el portal de un padre/madre (estado de asistencia de sus hijos)
router.get('/:id', async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id);
    if (!parent) return res.status(404).json({ message: 'Portal no encontrado' });

    const studentIds = parent.children.map((c) => c.studentId).filter(Boolean);
    const students = await Student.find({ studentId: { $in: studentIds } });
    const studentByStudentId = new Map(students.map((s) => [s.studentId, s]));
    const attendance = await Attendance.find({ studentId: { $in: students.map((s) => s._id) } }).sort('-date');

    const payload = parent.toJSON();
    payload.children = parent.children.map((child) => {
      const student = studentByStudentId.get(child.studentId);
      const childAttendance = student
        ? attendance
            .filter((record) => record.studentId.toString() === student._id.toString())
            .map((record) => record.toJSON())
        : [];

      return {
        name: child.name,
        studentId: child.studentId,
        studentName: student ? student.name : child.name,
        attendance: childAttendance
      };
    });

    res.json(payload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
