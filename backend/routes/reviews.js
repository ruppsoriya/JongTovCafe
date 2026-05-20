const express = require('express');
const router = express.Router();
const { addReview, getReviews } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.post('/', auth, addReview);
router.get('/cafe/:cafeId', getReviews);

module.exports = router;
