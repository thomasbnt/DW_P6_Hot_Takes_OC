const express = require('express');
const router = express.Router();
const SaucesCtrl = require('../controllers/sauces');

const auth = require('../middlewares/authenticateToken');
const upload = require('../middlewares/multer');

router.get('/', auth, SaucesCtrl.GetAllSauces);
router.get('/:id', auth, SaucesCtrl.GetSaucesPerID);
router.post('/', auth, upload.single('image'), SaucesCtrl.CreateSauce);
router.put('/:id', auth, SaucesCtrl.UpdateSauce);
router.delete('/:id', auth, SaucesCtrl.DeleteSauce);
router.post('/:id/like', auth, SaucesCtrl.LikeSauce);

module.exports = router;
