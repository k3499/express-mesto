const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');

router.get('*', () => {
  throw new NotFoundError('Такой путь не существует.');
});

module.exports = router;
