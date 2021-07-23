const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); //

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
      } else if (err.message === 'NotValidId') {
        res.status(ERR_CODE_404).send({ message: 'Объект не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      { email,
      password: hash,
      name,
      about,
      avatar,
     }
     ))
    .then((user) => res.status(ERR_CODE_200).send({ data: { _id: user._id, email: user.email } }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_400).send(err);
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          // хеши не совпали — отклоняем промис
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }

        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
          { expiresIn: "7d" }
        );
        return res
          .cookie("jwt", token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          })
          .send({ message: "Вы успешно авторизованны!" });
      });
    })
    .catch(
      res
        .status(401)
        .send({ message: "404" });
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
      } else if (err.message === 'NotValidId') {
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
      } else if (err.message === 'NotValidId') {
        res.status(ERR_CODE_404).send({ message: 'Объект не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {

  getUsers, getUser, createUser, updateUser, updateAvatar, login,

};
