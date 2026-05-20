const { Cafe, Review } = require('../models');
const recommendUtil = require('../utils/recommendation');

exports.listCafes = async (req, res) => {
  try {
    const { q, tags, minRating, maxPrice, openNow } = req.query;
    const where = {};
    if (q) where.name = { [require('sequelize').Op.like]: `%${q}%` };
    if (minRating) where.rating = { [require('sequelize').Op.gte]: Number(minRating) };
    if (maxPrice) where.priceLevel = { [require('sequelize').Op.lte]: Number(maxPrice) };
    if (openNow) where.isOpen = openNow === 'true';
    const cafes = await Cafe.findAll({ where, limit: 100 });
    res.json(cafes);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getCafe = async (req, res) => {
  try {
    const cafe = await Cafe.findByPk(req.params.id, { include: [Review] });
    if (!cafe) return res.status(404).json({ message: 'Cafe not found' });
    res.json(cafe);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createCafe = async (req, res) => {
  try {
    const cafe = await Cafe.create(req.body);
    res.json(cafe);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateCafe = async (req, res) => {
  try {
    await Cafe.update(req.body, { where: { id: req.params.id } });
    const cafe = await Cafe.findByPk(req.params.id);
    res.json(cafe);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteCafe = async (req, res) => {
  try {
    await Cafe.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.recommend = async (req, res) => {
  try {
    const cafes = await Cafe.findAll({ limit: 500 });
    const userPrefs = req.query.prefs ? JSON.parse(req.query.prefs) : {};
    const recs = recommendUtil.recommend(cafes.map(c => c.toJSON()), userPrefs);
    res.json(recs.slice(0, 20));
  } catch (err) { res.status(500).json({ message: err.message }); }
};
