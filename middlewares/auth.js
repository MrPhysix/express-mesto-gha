const { verifyJwt } = require('../utils/jwt');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new Error('Необходима авторизация');
    err.statusCode = 400;

    next(err);
  }

  const token = extractBearerToken(authorization);

  let payload;
  try {
    payload = verifyJwt(token);
  } catch (e) {
    const err = new Error('Необходима авторизация (некоректный токен)');
    err.statusCode = 401;

    next(err);
  }
  req.user = payload; // объект запроса ? а как в header ?
  next();
};
