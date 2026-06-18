const express = require('express');
const router = express.Router();
const StatsController = require('../Controller/StatsController');

router.get('/summary', StatsController.summary);

module.exports = router;
