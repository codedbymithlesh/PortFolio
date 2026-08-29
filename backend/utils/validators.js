const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const validatePassword = (password, minLength = 8) => {
  if (!password || typeof password !== 'string') return false;
  return password.trim().length >= minLength;
};

const validateRequired = (fields, body) => {
  const missing = fields.filter((f) => !body[f] || (typeof body[f] === 'string' && !body[f].trim()));
  return missing;
};

module.exports = { validateEmail, validatePassword, validateRequired };
