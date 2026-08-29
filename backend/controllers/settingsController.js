const Settings = require('../models/Settings');
const asyncHandler = require('../utils/asyncHandler');

const getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.find().select('-__v');
  res.json(settings);
});

const updateSetting = asyncHandler(async (req, res) => {
  const { key, value } = req.body;
  if (!key || value === undefined) {
    return res.status(400).json({ message: 'Key and value are required' });
  }
  const setting = await Settings.findOneAndUpdate(
    { key },
    { key, value },
    { upsert: true, new: true }
  );
  res.json(setting);
});

module.exports = { getSettings, updateSetting };
