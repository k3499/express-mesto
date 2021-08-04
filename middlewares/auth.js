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
    payload = jwt.verify(token, 'dev-secret');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация токен не пошел' });
  }

  req.user = payload;

  next();
};