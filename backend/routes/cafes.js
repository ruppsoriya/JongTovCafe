const express = require('express');
const router = express.Router();
const { listCafes, getCafe, createCafe, updateCafe, deleteCafe, recommend } = require('../controllers/cafeController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', listCafes);
router.get('/recommend', recommend);
router.get('/:id', getCafe);
router.post('/', auth, admin, createCafe);
router.put('/:id', auth, admin, updateCafe);
router.delete('/:id', auth, admin, deleteCafe);

module.exports = router;
