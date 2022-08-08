const express = require('express');
const router = express.Router();
const UserDelCtrl = require('../controllers/deleteAccount');

router.post('/', UserDelCtrl.Del);

module.exports = router;
