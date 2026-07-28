const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');
const { requireAuth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const grades = await Grade.find().sort('name');
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const grade = await Grade.create({ name: req.body.name });
    res.status(201).json(grade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Grade.findByIdAndDelete(req.params.id);
    res.json({ message: 'Grado eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
