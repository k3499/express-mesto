const router = require('express').Router();
const {
  getCards, deleteCard, addCard, addLike, removeLike,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.delete('/cards/:cardId', deleteCard);

router.post('/cards', addCard);

router.put('/cards/:cardId/likes', addLike);

router.delete('/cards/:cardId/likes', removeLike);

module.exports = router;
