const { Op } = require('sequelize');
const { Cafe, Review, User } = require('../models');
const recommendUtil = require('../utils/recommendation');

exports.listCafes = async (req, res) => {
  try {
    const {
      q,
      minRating,
      maxPrice,
      openNow,
      fastWifi,
      studyFriendly,
      familyFriendly,
      outdoorSeating,
      airConditioning,
      tags
    } = req.query;

    const where = {};
    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } }
      ];
    }
    if (minRating) where.rating = { [Op.gte]: Number(minRating) };
    if (maxPrice) where.priceLevel = { [Op.lte]: Number(maxPrice) };
    if (openNow) where.isOpen = openNow === 'true';

    let cafes = await Cafe.findAll({ where });

    // SQLite JSON filtering is limited, so apply feature filters in memory.
    cafes = cafes.filter((cafe) => {
      const c = cafe.toJSON();
      const cafeTags = c.tags || [];
      const facilities = c.facilities || [];

      if (fastWifi === 'true' && !(c.wifiSpeed >= 20 || cafeTags.includes('Fast WiFi') || facilities.includes('Fast WiFi'))) return false;
      if (studyFriendly === 'true' && !(cafeTags.includes('Study-friendly') || facilities.includes('Study-friendly'))) return false;
      if (familyFriendly === 'true' && !(cafeTags.includes('Family-friendly') || facilities.includes('Family-friendly'))) return false;
      if (outdoorSeating === 'true' && !(cafeTags.includes('Outdoor') || facilities.includes('Outdoor seating'))) return false;
      if (airConditioning === 'true' && !(cafeTags.includes('Air conditioning') || facilities.includes('Air conditioning'))) return false;

      if (tags) {
        const reqTags = String(tags).split(',').map((t) => t.trim()).filter(Boolean);
        if (!reqTags.every((t) => cafeTags.includes(t) || facilities.includes(t))) return false;
      }

      return true;
    });

    res.json(cafes);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getCafe = async (req, res) => {
  try {
    const cafe = await Cafe.findByPk(req.params.id, {
      include: [{ model: Review, include: [{ model: User, attributes: ['id', 'name'] }] }]
    });
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
    const cafes = await Cafe.findAll();
    const userPrefs = req.query.prefs ? JSON.parse(req.query.prefs) : {};
    const recs = recommendUtil.recommend(cafes.map(c => c.toJSON()), userPrefs);
    res.json(recs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
