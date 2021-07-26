const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new Unauthorized('Необходима авторизация.');
  }
  let payload;

  try {
    payload = jwt.verify(
      token, 'dev-secret',
    );
  } catch (err) {
    throw new Unauthorized('Необходима авторизация.');
  }

  req.user = payload; // записываем пейлоад

  return next(); // запрос идет дальше
};
