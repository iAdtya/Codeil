const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');

module.exports = router;

router.get('/',homeController.home);
router.use('/users',require('./users'));
router.use('/posts',require('./posts'));

console.log('router loaded');