const express = require('express');
const router = express.Router();
const SaucesCtrl = require('../controllers/sauces');

router.get('/', SaucesCtrl.GetAllSauces);
//router.get('/:id', SaucesCtrl.GetSaucesPerID);
router.post('/', SaucesCtrl.CreateSauce);

module.exports = router;
