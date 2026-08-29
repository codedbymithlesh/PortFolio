const asyncHandler = require('../utils/asyncHandler');

const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.get('host');
  const url = `${protocol}://${host}/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

module.exports = { uploadFile };
