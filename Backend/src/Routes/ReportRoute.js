const express = require('express');
const router = express.Router();
const ReportController = require('../Controller/ReportController');

router.get('/summary', ReportController.summary);

module.exports = router;
