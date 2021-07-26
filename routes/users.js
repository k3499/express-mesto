const router = require('express').Router();
const {

  getUsers, getUser, createUser, updateUser, updateAvatar, getProfileInfo,

} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getProfileInfo);

router.get('/users/:userId', getUser);

router.post('/users', createUser);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
