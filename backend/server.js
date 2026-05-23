const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth');
const cafeRoutes = require('./routes/cafes');
const reviewRoutes = require('./routes/reviews');
const googleRoutes = require('./routes/google');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const PORT = parseInt(process.env.PORT, 10) || 5000;

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
app.use('/api/google', googleRoutes);

app.get('/', (req, res) => res.send({ ok: true, msg: 'Cafe Recs API' }));

const startServer = (port, attempts = 5) => {
  const server = app.listen(port, () => console.log(`Server running on port ${port}`));

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      if (attempts <= 0) {
        console.error(`Port ${port} in use and no attempts left. Exiting.`);
        process.exit(1);
      }
      console.warn(`Port ${port} in use, trying port ${port + 1}...`);
      setTimeout(() => startServer(port + 1, attempts - 1), 300);
    } else {
      console.error('Server error', err);
      process.exit(1);
    }
  });
};

startServer(PORT);
