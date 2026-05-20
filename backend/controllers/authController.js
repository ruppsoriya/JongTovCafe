const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Cafe } = require('../models');

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ message: 'User exists' });
    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashed });
    res.json({ token: genToken(user.id), user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    res.json({ token: genToken(user.id), user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.me = async (req, res) => {
  res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
};

exports.listFavorites = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Cafe, as: 'favoriteCafes' }]
    });
    res.json(user ? user.favoriteCafes : []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const cafe = await Cafe.findByPk(req.params.cafeId);
    if (!cafe) return res.status(404).json({ message: 'Cafe not found' });
    await user.addFavoriteCafe(cafe);
    res.json({ message: 'Added to favorites' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const cafe = await Cafe.findByPk(req.params.cafeId);
    if (!cafe) return res.status(404).json({ message: 'Cafe not found' });
    await user.removeFavoriteCafe(cafe);
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
