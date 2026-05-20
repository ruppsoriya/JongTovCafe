const { Review, Cafe, User } = require('../models');

exports.addReview = async (req, res) => {
  try {
    const { cafeId, rating, text } = req.body;
    const review = await Review.create({ rating, text, CafeId: cafeId, UserId: req.user.id });
    await Cafe.increment('popularity', { by: 1, where: { id: cafeId } });
    res.json(review);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({ where: { CafeId: req.params.cafeId }, include: [{ model: User, attributes: ['name'] }] });
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
