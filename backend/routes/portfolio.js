const express = require('express');
const jwt = require('jsonwebtoken');
const Portfolio = require('../models/Portfolio');
const router = express.Router();

// Middleware — verify JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// GET /api/portfolio — public
router.get('/', async (req, res) => {
  try {
    let data = await Portfolio.findOne();
    if (!data) {
      // Seed an empty structure on first request if nothing exists in DB
      data = await Portfolio.create({
        hero: {
          name: '',
          subtitle: '',
          bio: '',
          profileImage: '',
        },
        about: {
          professionalSummary: '',
          quote: '',
          badges: [],
        },
        education: [],
        skills: {
          frontend: [],
          backend: [],
          tools: [],
        },
        projects: [],
        contact: {
          email: '',
          location: '',
          github: '',
          linkedin: '',
          youtube: '',
        },
      });
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/portfolio — protected
router.put('/', authMiddleware, async (req, res) => {
  try {
    let data = await Portfolio.findOne();
    if (!data) {
      data = new Portfolio(req.body);
    } else {
      // Deep-merge or replace the sections
      const fields = ['hero', 'about', 'education', 'skills', 'projects', 'contact'];
      fields.forEach((field) => {
        if (req.body[field] !== undefined) {
          data[field] = req.body[field];
        }
      });
    }
    await data.save();
    res.json({ message: 'Portfolio updated', data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
