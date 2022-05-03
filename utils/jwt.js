const jwt = require('jsonwebtoken');

const JWT_KEY = 'secret-key';

function getJwt(user) {
  return jwt.sign({ _id: user._id }, JWT_KEY, { expiresIn: '7d' });
}

function verifyJwt(token) {
  return jwt.verify(token, JWT_KEY);
}

module.exports = {
  getJwt,
  verifyJwt,
};
