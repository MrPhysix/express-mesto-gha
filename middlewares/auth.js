const { verifyJwt } = require('../utils/jwt');

module.exports = (req, res, next) => {
  // const { authorization } = req.headers;
  const { jwt } = req.cookies;
  console.log(jwt);
  if (!jwt) {
    const err = new Error('Необходима авторизация');
    err.statusCode = 401;

    next(err);
  }

  let payload;
  try {
    payload = verifyJwt(jwt);
  } catch (e) {
    const err = new Error('Необходима авторизация (некоректный токен)');
    err.statusCode = 401;

    next(err);
  }
  req.user = payload;
  next();
};
