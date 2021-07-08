const User = require('../models/user');
const { ERR_CODE_404, ERR_CODE_400, ERR_CODE_200 } = require('../serverErrors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(ERR_CODE_200).send(users))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_CODE_400).send({ message: 'Переданы некоректные данные' });
      } else if (err.name === 'NotFound') {
        res.status(ERR_CODE_404).send({ message: 'Объект не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(ERR_CODE_200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_CODE_400).send({ message: 'Переданы некоректные данные' });
      } else if (err.name === 'NotFound') {
        res.status(ERR_CODE_404).send({ message: 'Объект не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const addUser = (req, res) => {
  const data = { ...req.body };

  return User.create(data)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(ERR_CODE_200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_CODE_400).send({ message: 'Переданы некоректные данные' });
      } else if (err.name === 'NotFound') {
        res.status(ERR_CODE_404).send({ message: 'Объект не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, {
    runValidators: true,
    new: true,
  })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(ERR_CODE_200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_CODE_400).send({ message: 'Переданы некоректные данные' });
      } else if (err.name === 'NotFound') {
        res.status(ERR_CODE_404).send({ message: 'Объект не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    runValidators: true,
    new: true,
  })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_CODE_400).send({ message: 'Переданы некоректные данные' });
      } else if (err.name === 'NotFound') {
        res.status(ERR_CODE_404).send({ message: 'Объект не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {

  getUsers, getUser, addUser, updateUser, updateAvatar,

};
