const express = require('express');
const router = express.Router();
const { register, login, me, addFavorite, removeFavorite, listFavorites, listUsers } = require('../controllers/authController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);
router.get('/favorites', auth, listFavorites);
router.post('/favorites/:cafeId', auth, addFavorite);
router.delete('/favorites/:cafeId', auth, removeFavorite);
router.get('/users', auth, admin, listUsers);

module.exports = router;
