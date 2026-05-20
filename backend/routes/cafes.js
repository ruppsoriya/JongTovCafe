const express = require('express');
const router = express.Router();
const { listCafes, getCafe, createCafe, updateCafe, deleteCafe, recommend } = require('../controllers/cafeController');
const auth = require('../middleware/auth');

router.get('/', listCafes);
router.get('/recommend', recommend);
router.get('/:id', getCafe);
router.post('/', auth, createCafe);
router.put('/:id', auth, updateCafe);
router.delete('/:id', auth, deleteCafe);

module.exports = router;
