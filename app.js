const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');
const users = require('./routes/users');
const cards = require('./routes/cards');

const app = express();

const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(helmet());
app.use('/', express.static(path.join(__dirname, '.', 'public')));
app.use((req, res, next) => {
  req.user = {
    _id: '60e57080f6514757343d3fa0',
  };
  next();
});

app.use('/', express.json());
app.use('/', users);
app.use('/', cards);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {

});
