const Card = require('../models/card');
const { ERR_CODE_200 } = require('../serverErrors');
const BadRequest = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(ERR_CODE_200).send(cards))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new NotFoundError('Карточка не найдена.'))
    .then((card) => {
      res.status(ERR_CODE_200).send({ message: `Карточка ${card} удалена` });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequest('Передан неправильный ID карточки.'),
        );
      }
      return next(err);
    });
};

const addCard = (req, res, next) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(ERR_CODE_200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest('Некорректные данные создания карточки.'),
        );
      }
      return next(err);
    });
};

const addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new NotFoundError('Некорректные данные для лайка.'))
    .then((card) => {
      res.status(ERR_CODE_200).send( card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный ID карточки.'));
      }
      return next(err);
    });
};

const removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new NotFoundError('Некорректные данные для дизлайка.'))
    .then((card) => {
      res.status(ERR_CODE_200).send( card );
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный ID карточки.'));
      }
      return next(err);
    });
};

module.exports = {

  getCards, deleteCard, addCard, addLike, removeLike,

};
