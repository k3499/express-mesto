const Card = require('../models/card');
const { ERR_CODE_404, ERR_CODE_400, ERR_CODE_200 } = require('../serverErrors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(ERR_CODE_200).send(cards))
    .catch((err) => res.status(ERR_CODE_400).send(err));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(ERR_CODE_200).send({ message: `Карточка ${card} удалена` });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_CODE_400).send({ message: 'Переданы некоректные данные' });
      } else if (err.message === 'NotValidId') {
        res.status(ERR_CODE_404).send({ message: 'Объект не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const addCard = (req, res) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(ERR_CODE_200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_400).send(err);
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(ERR_CODE_200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_CODE_400).send({ message: 'Переданы некоректные данные' });
      } else if (err.message === 'NotValidId') {
        res.status(ERR_CODE_404).send({ message: 'Объект не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(ERR_CODE_200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_CODE_400).send({ message: 'Переданы некоректные данные' });
      } else if (err.message === 'NotValidId') {
        res.status(ERR_CODE_404).send({ message: 'Объект не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {

  getCards, deleteCard, addCard, addLike, removeLike,

};
