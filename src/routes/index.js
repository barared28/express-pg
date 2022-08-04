const express = require("express");
const router = express.Router();

const {
    getMyImages, storeImage, deleteImage,
    getImagesByUserId, getImagesByImageId,
} = require('../controllers/image');
const { register, login } = require('../controllers/auth');

const { auth } = require('../middlewares/auth');

router.post("/login", login);
router.post("/register", register);

router.post('/store-image', auth, storeImage);
router.get('/my-images', auth, getMyImages);
router.get('/user-images/:id', auth, getImagesByUserId);
router.get('/image/:id', auth, getImagesByImageId);
router.delete('/delete-image/:id', auth, deleteImage);

module.exports = router;