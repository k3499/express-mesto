const router = require('express').Router();
const {getUsers, getUser, addUser, updateUser, updateAvatar} = require('../controllers/users')

router.get('/users', getUsers);

router.get('/users/:userId', getUser);

router.post('/users', addUser );

router.patch('/users/me', updateUser );

router.patch('/users/me/avatar', updateAvatar );

module.exports = router;