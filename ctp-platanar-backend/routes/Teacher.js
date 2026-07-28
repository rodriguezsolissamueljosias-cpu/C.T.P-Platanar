const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const { requireAuth } = require('../middleware/auth');

function signToken(teacher, roleOverride) {
  return jwt.sign(
    { id: teacher._id.toString(), email: teacher.email, role: roleOverride || teacher.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Registrar profesor
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, subject } = req.body;
    if (!firstName || !email || !password) {
      return res.status(400).json({ message: 'Nombre, correo y contraseña son obligatorios' });
    }

    const existing = await Teacher.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Ya existe un profesor con ese correo' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = await Teacher.create({ firstName, lastName, email, phone, subject, password: hashedPassword });

    const token = signToken(teacher);
    const payload = teacher.toJSON();
    res.status(201).json({ ...payload, teacherId: payload.id, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login profesor
router.post('/login', async (req, res) => {
  try {
    const { email, password, accessCode } = req.body;
    const teacher = await Teacher.findOne({ email: (email || '').toLowerCase() });
    if (!teacher) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    if (!teacher.isActive) {
      return res.status(403).json({ message: 'Este profesor está bloqueado, contacta a un administrador' });
    }

    const validPassword = await bcrypt.compare(password || '', teacher.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const role = accessCode && accessCode === process.env.ADMIN_ACCESS_CODE ? 'admin' : teacher.role;
    const token = signToken(teacher, role);
    const payload = teacher.toJSON();
    res.json({ ...payload, teacherId: payload.id, role, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Resumen de padres (estudiantes con datos de contacto registrados)
// Debe declararse antes de cualquier ruta con :id para no chocar con ella.
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

// Listar profesores
router.get('/', requireAuth, async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar profesor (p. ej. activar/bloquear o cambiar rol)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password;
    delete updates.email;

    const teacher = await Teacher.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!teacher) return res.status(404).json({ message: 'Profesor no encontrado' });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar profesor
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: 'Profesor eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
