const express = require('express');
const router = express.Router();
const LogController = require('../Controller/LogController');

router.get('/', LogController.list);

module.exports = router;
