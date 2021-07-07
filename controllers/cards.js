const Card = require('../models/card');
const {ERR_CODE_404, ERR_CODE_400, ERR_CODE_200} = require('../serverErrors.js');

const getCards = (req, res) => {
  return Card.find({})
  .then( cards => res.status(ERR_CODE_200).send(cards))
  .catch( err => res.status(ERR_CODE_400).send(err) )
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .then( (card) => {
    if (!card) {
      return res.status(ERR_CODE_404).send({message: 'Запрашиваемая карточка не найдена'});
    }
    return res.status(ERR_CODE_200).send({ message: `Карточка ${card} удалена` });
  })
  .catch( err => res.status(ERR_CODE_400).send(err) )
};

const addCard = (req, res) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({name, link, owner})
  .then((card) => {
      res.status(ERR_CODE_200).send(card);
    })
  .catch( err => res.status(ERR_CODE_400).send(err) )
};

const addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
  .then( (card) => {
      if (!card) {
        return res.status(ERR_CODE_404).send({message: 'Запрашиваемая карточка не найдена'});
      }
      return res.status(ERR_CODE_200).send({ card });
    })
    .catch( err => res.status(ERR_CODE_400).send(err) )
};

const removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
  .then( (card) => {
    if (!card) {
      return res.status(ERR_CODE_404).send({message: 'Запрашиваемая карточка не найдена'});
    }
    return res.status(ERR_CODE_200).send({ card });
  })
  .catch( err => res.status(ERR_CODE_400).send(err) )
};


module.exports = {getCards, deleteCard, addCard, addLike, removeLike};