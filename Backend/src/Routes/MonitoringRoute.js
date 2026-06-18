const express = require('express');
const router = express.Router();
const MonitoringController = require('../Controller/MonitoringController');

router.get('/status', MonitoringController.status);

module.exports = router;
