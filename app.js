const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors, celebrate, Joi } = require('celebrate');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();

const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use('/', express.json());
app.use(helmet());

app.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(
      /^((http|https):\/\/)(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.)+[A-Za-zА-Яа-я0-9-]{2,8}(([\w\-._~:/?#[\]@!$&'()*+,;=])*)/,
    ),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use(auth);

app.use('/', users);
app.use('/', cards);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errors()); // обработчик celebrate

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {

});
