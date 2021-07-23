const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require("./controllers/users");

const app = express();

const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(helmet());

app.use('/', express.json());
app.use('/', users);
app.use('/', cards);
app.post('/signin', login);
app.post('/signup', createUser);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {

});
