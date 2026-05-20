const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth');
const cafeRoutes = require('./routes/cafes');
const reviewRoutes = require('./routes/reviews');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const PORT = process.env.PORT || 5000;

const { sequelize } = require('./models');

async function connectDb() {
  try {
    await sequelize.sync();
    console.log('SQLite (Sequelize) connected and synced');
  } catch (err) { console.error('DB connection error', err); }
}

connectDb();

app.use('/api/auth', authRoutes);
app.use('/api/cafes', cafeRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => res.send({ ok: true, msg: 'Cafe Recs API' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
