const { URL } = require('url');

function getDatabaseMode() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return { usePostgres: false, reason: 'missing-database-url' };
  }

  if (process.env.USE_POSTGRES === 'true') {
    return { usePostgres: true, reason: 'forced-postgres' };
  }

  try {
    const host = new URL(databaseUrl).hostname;

    if (host === 'postgres' && process.env.RUNNING_IN_DOCKER !== 'true') {
      return { usePostgres: false, reason: 'docker-compose-host-without-docker' };
    }
  } catch {
    // Ignore malformed URLs here and let Sequelize surface the real error later.
  }

  return { usePostgres: true, reason: 'database-url-present' };
}

module.exports = { getDatabaseMode };