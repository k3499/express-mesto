const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET = 'dev-secret', NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: authorization });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret"
    );
  } catch (err) {
    return res
      .status(401)
      .send({ message: token });
  }

  req.user = payload;

  next();
};