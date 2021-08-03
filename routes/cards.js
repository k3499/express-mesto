const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {
  getCards, deleteCard, addCard, addLike, removeLike,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.delete('/cards/:cardId',
  celebrate({
    params: Joi.object().keys({ cardId: Joi.string().hex().length(24) }),
  }), deleteCard);

router.post('/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .pattern(
          /^((http|https):\/\/)(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.)+[A-Za-zА-Яа-я0-9-]{2,8}(([\w\-._~:/?#[\]@!$&'()*+,;=])*)/,
        ),
    }),
  }), addCard);

router.put('/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({ cardId: Joi.string().hex().length(24) }),
  }), addLike);

router.delete('/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({ cardId: Joi.string().hex().length(24) }),
  }), removeLike);

module.exports = router;
