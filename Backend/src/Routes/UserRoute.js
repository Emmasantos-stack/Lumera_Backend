const express = require('express');
const router = express.Router();
const UserController = require('../Controller/UserController');

router.get('/managers', UserController.listManagers);
router.post('/managers', UserController.createManager);
router.delete('/managers/:id', UserController.deleteManager);
router.get('/', UserController.listUsers);
router.post('/', UserController.createUser);
router.delete('/:id', UserController.deleteUser);

module.exports = router;
