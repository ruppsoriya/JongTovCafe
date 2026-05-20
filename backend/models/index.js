const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'data', 'database.sqlite'),
  logging: false
});

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'user' },
  preferences: { type: DataTypes.JSON, defaultValue: {} }
});

const Cafe = sequelize.define('Cafe', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  images: { type: DataTypes.JSON, defaultValue: [] },
  location: { type: DataTypes.JSON, defaultValue: {} },
  rating: { type: DataTypes.FLOAT, defaultValue: 4.0 },
  priceLevel: { type: DataTypes.INTEGER, defaultValue: 2 },
  tags: { type: DataTypes.JSON, defaultValue: [] },
  wifiSpeed: DataTypes.INTEGER,
  isOpen: { type: DataTypes.BOOLEAN, defaultValue: true },
  facilities: { type: DataTypes.JSON, defaultValue: [] },
  openingHours: { type: DataTypes.JSON, defaultValue: {} },
  popularity: { type: DataTypes.INTEGER, defaultValue: 0 }
});

const Review = sequelize.define('Review', {
  rating: { type: DataTypes.INTEGER, allowNull: false },
  text: DataTypes.TEXT
});

User.belongsToMany(Cafe, { through: 'FavoriteCafes', as: 'favoriteCafes' });
Cafe.belongsToMany(User, { through: 'FavoriteCafes', as: 'favoritedByUsers' });

User.hasMany(Review);
Review.belongsTo(User);
Cafe.hasMany(Review);
Review.belongsTo(Cafe);

module.exports = { sequelize, User, Cafe, Review };
