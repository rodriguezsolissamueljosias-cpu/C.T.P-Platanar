const express = require('express');
const router = express.Router();
const Section = require('../models/Section');
const { requireAuth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const sections = await Section.find().sort('name');
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const section = await Section.create({ name: req.body.name });
    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Section.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sección eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
