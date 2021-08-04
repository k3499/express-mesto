const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ERR_CODE_200 } = require('../serverErrors');
const BadRequest = require('../errors/bad-request-err');
const Conflict = require('../errors/conflict');
const NotFoundError = require('../errors/not-found-err');
const Unauthorized = require('../errors/unauthorized');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(ERR_CODE_200).send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Пользователь с указанным _id не найден.'))
    .then((user) => {
      res.status(ERR_CODE_200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequest('Передан неправильный ID пользователя.'),
        );
      }
      return next(err);
    });
};

const getProfileInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь с указанным _id не найден.'))
    .then((user) => {
      res.status(ERR_CODE_200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest('Некорректные данные при обновлении профиля.'),
        );
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        email,
        password: hash,
        name,
        about,
        avatar,
      },
    ))
    .then((user) => res.send({ name: user.name, about: user.about, email: user.email }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new Conflict('email используется'));
      } else if (err.name === 'ValidationError') {
        next(
          new BadRequest(
            'Некорректные данные при создании пользователя.',
          ),
        );
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Неправильные почта или пароль.');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new Unauthorized('Неправильные почта или пароль.');
        }

        const token = jwt.sign(
          { _id: user._id }, 'dev-secret',
          { expiresIn: '7d' },
        );
        res.send({ token });
        // return res
        //   .cookie('jwt', token, {
        //     maxAge: 3600000 * 24 * 7,
        //     httpOnly: true,
        //     sameSite: true,
        //   })
        //   .send({ message: 'Вы успешно авторизованны!' });
      });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, {
    runValidators: true,
    new: true,
  })
    .orFail(new NotFoundError('Пользователь с указанным _id не найден.'))
    .then((user) => res.status(ERR_CODE_200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest('Некорректные данные обновления профиля.'),
        );
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    runValidators: true,
    new: true,
  })
    .orFail(new NotFoundError('Пользователь с указанным _id не найден.'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest('Переданы некорректные данные при обновлении профиля.'),
        );
      }
      return next(err);
    });
};

module.exports = {

  getUsers, getUser, createUser, updateUser, updateAvatar, login, getProfileInfo,

};
