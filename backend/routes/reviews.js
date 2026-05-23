const express = require('express');
const router = express.Router();
const { addReview, getReviews, listReviews, deleteReview } = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', auth, addReview);
router.get('/cafe/:cafeId', getReviews);
router.get('/', auth, admin, listReviews);
router.delete('/:id', auth, admin, deleteReview);

module.exports = router;
