const Portfolio = require('../models/Portfolio');
const asyncHandler = require('../utils/asyncHandler');

const PORTFOLIO_FIELDS = ['hero', 'about', 'education', 'skills', 'projects', 'contact'];

const DEFAULT_PORTFOLIO = {
  hero: { name: '', subtitle: '', bio: '', profileImage: '' },
  about: { professionalSummary: '', quote: '', badges: [] },
  education: [],
  skills: { frontend: [], backend: [], tools: [] },
  projects: [],
  contact: { email: '', location: '', github: '', linkedin: '', youtube: '' },
};

const getPortfolio = asyncHandler(async (req, res) => {
  let data = await Portfolio.findOne();
  if (!data) {
    data = await Portfolio.create(DEFAULT_PORTFOLIO);
  }
  res.json(data);
});

const updatePortfolio = asyncHandler(async (req, res) => {
  let data = await Portfolio.findOne();
  if (!data) {
    data = new Portfolio(req.body);
  } else {
    PORTFOLIO_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
        data.markModified(field);
      }
    });
  }
  await data.save();
  res.json({ message: 'Portfolio updated', data });
});

module.exports = { getPortfolio, updatePortfolio };
