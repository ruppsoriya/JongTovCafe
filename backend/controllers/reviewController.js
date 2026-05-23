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

exports.listReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Cafe, attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await Review.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
