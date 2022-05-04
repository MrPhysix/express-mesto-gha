const { verifyJwt } = require('../utils/jwt');
const LoginError = require('../errors/LoginError');

module.exports = (req, res, next) => {
  // const { authorization } = req.headers;
  const { jwt } = req.cookies;
  if (!jwt) {
    throw new LoginError('Необходима авторизация');
  }

  let payload;
  try {
    payload = verifyJwt(jwt);
  } catch (err) {
    next(new LoginError('Необходима авторизация [token]'));
  }
  req.user = payload;
  next();
};
