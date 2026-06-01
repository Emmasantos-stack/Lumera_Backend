const express = require('express');
const router = express.Router();
const ChatController = require('../Controller/ChatController');

router.get('/', ChatController.listMessages);
router.post('/', ChatController.createMessage);

module.exports = router;
