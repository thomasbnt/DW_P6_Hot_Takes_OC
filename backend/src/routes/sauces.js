const express = require('express');
const router = express.Router();
const cors = require("cors");
const SaucesCtrl = require('../controllers/sauces');

const auth = require('../middlewares/authenticateToken');
const upload = require('../middlewares/multer');

router.get('/', cors({methods: "GET"}), auth, SaucesCtrl.GetAllSauces);
router.get('/:id', cors({methods: "GET"}), auth, SaucesCtrl.GetSaucesPerID);
router.post('/', cors({methods: "POST"}), auth, upload.single('image'), SaucesCtrl.CreateSauce);
router.put('/:id', cors({methods: "PUT"}), auth, upload.single('image') ,SaucesCtrl.UpdateSauce);
router.delete('/:id', cors({methods: "DELETE"}), auth, SaucesCtrl.DeleteSauce);
router.post('/:id/like', cors({methods: "POST"}), auth, SaucesCtrl.LikeSauce);

module.exports = router;
