const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { Authorization } = req.headers;

  if (!Authorization || !Authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = Authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, 'dev-secret');
  } catch (err) {
    return res
      .status(401)
      .send({ message: token });
  }

  req.user = payload;

  next();
};