const express = require('express'); 
const router = express.Router();
const passport = require('passport');

const postsController = require('../controllers/posts_controller');

router.post('/create', passport.checkAuthentication,postsController.create);

router.post('/comment', passport.checkAuthentication, postsController.comment);

module.exports = router;