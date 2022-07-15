const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/login');

router.post('/', UserCtrl.UserController);

module.exports = router;
