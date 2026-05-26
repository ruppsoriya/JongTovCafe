const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { execFileSync } = require('child_process');
const path = require('path');
dotenv.config();
const { getDatabaseMode } = require('./utils/database');

const databaseMode = getDatabaseMode();

// Environment checks (do not print secret values)
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET not set — using insecure default in development');
}
if (!process.env.DATABASE_URL) {
  console.log('No DATABASE_URL found — using local SQLite database');
} else if (databaseMode.usePostgres) {
  console.log('DATABASE_URL detected — using external Postgres database');
} else {
  console.log('DATABASE_URL points to a local Docker hostname — using SQLite database instead');
}
if (!process.env.GOOGLE_PLACES_API_KEY) {
  console.warn('Google Places API key not set (GOOGLE_PLACES_API_KEY) — some features disabled');
}

const authRoutes = require('./routes/auth');
const cafeRoutes = require('./routes/cafes');
const reviewRoutes = require('./routes/reviews');
const googleRoutes = require('./routes/google');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// IP allowlist middleware (optional) - move after CORS so preflight still works
const ipAllowlist = require('./middleware/ipAllowlist');
app.use(ipAllowlist);

const PORT = parseInt(process.env.PORT, 10) || 5000;

const { sequelize, Cafe } = require('./models');

async function connectDb() {
  try {
    await sequelize.sync();
    console.log('Sequelize database connected and synced');

    const cafeCount = await Cafe.count();
    if (cafeCount === 0) {
      console.log('No cafes found, running seed script');
      execFileSync(process.execPath, [path.join(__dirname, 'seed.js')], {
        stdio: 'inherit'
      });
    }
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
