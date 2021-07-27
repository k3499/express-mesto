
const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {

  getUsers, getUser, createUser, updateUser, updateAvatar, getProfileInfo,

} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getProfileInfo);

router.get('/users/:userId',
celebrate({
  params: Joi.object().keys({ userId: Joi.string().hex().length(24) }),
}), getUser);

router.post('/users', createUser);

router.patch('/users/me',
celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/users/me/avatar',
celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(
      /^((http|https):\/\/)(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.)+[A-Za-zА-Яа-я0-9-]{2,8}(([\w\-._~:/?#[\]@!$&'()*+,;=])*)/
    ),
  }),
}), updateAvatar);

module.exports = router;
