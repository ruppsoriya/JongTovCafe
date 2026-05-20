const dotenv = require('dotenv');
dotenv.config();

const sample = [
  { name: 'Campus Brew', description: 'Student-friendly cafe with fast WiFi', tags: ['Fast WiFi','Study-friendly'], rating:4.5, priceLevel:1, wifiSpeed:50, images:[], location:{address:'Near Campus', coords:{lat:0,lng:0}}, popularity:100 },
  { name: 'Riverside Coffee', description: 'Cozy spot with outdoor seating', tags: ['Outdoor','Good Coffee'], rating:4.6, priceLevel:2, wifiSpeed:10, images:[], location:{address:'Riverside', coords:{lat:0,lng:0}}, popularity:80 }
];

async function seed(){
  const { sequelize, Cafe } = require('./models');
  await sequelize.sync({ force: true });
  await Cafe.bulkCreate(sample.map(s => ({
    name: s.name,
    description: s.description,
    tags: s.tags,
    rating: s.rating,
    priceLevel: s.priceLevel,
    wifiSpeed: s.wifiSpeed,
    images: s.images,
    location: s.location,
    popularity: s.popularity
  })));
  console.log('Seeded cafes (SQLite)');
  process.exit();
}

seed().catch(e=>{console.error(e); process.exit(1)});
