const express = require('express');
const router = express.Router();

const metricsController = require('../controllers/monitor_controller');


router.get('/metrics',metricsController.metrics);

module.exports = router;