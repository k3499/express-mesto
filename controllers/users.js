const User = require('../models/user');
const {ERR_CODE_404, ERR_CODE_400, ERR_CODE_200} = require('../serverErrors.js');

const getUsers = (req, res) => {
  return User.find({})
  .then( users => res.status(ERR_CODE_200).send(users))
  .catch( err => res.status(ERR_CODE_400).send(err) )
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
  .then( (user) => {
    if (!user) {
      return res.status(ERR_CODE_404).send({message: 'Запрашиваемый пользователь не найден'});
    }
    return res.status(ERR_CODE_200).send(user);
  })
  .catch( err => res.status(ERR_CODE_400).send(err) )
};

const addUser = (req, res) => {
  const data = { ...req.body};

  return User.create(data)
    .then(user => res.status(ERR_CODE_200).send(user))
    .catch( (err) => res.status(ERR_CODE_400).send(err) );
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about })
    .then(user => res.status(ERR_CODE_200).send(user))
    .catch( (err) => res.status(ERR_CODE_400).send(err) );
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate( req.user._id, { avatar })
    .then((user) => {
      if (!user) {
        return res.status(ERR_CODE_404).send({message: 'Запрашиваемый пользователь не найден'});
      }
      res.send({ data: user });
    })
    .catch( (err) => res.status(ERR_CODE_400).send(err) );
};

module.exports = {getUsers, getUser, addUser, updateUser, updateAvatar};