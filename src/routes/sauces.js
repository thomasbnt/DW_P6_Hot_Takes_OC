const express = require('express');
const router = express.Router();
const SaucesCtrl = require('../controllers/sauces');

router.get('/', SaucesCtrl.SaucesController);

module.exports = router;
