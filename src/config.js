module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://amy@localhost/homerecs',
  CLIENT_ORIGIN: process.env.CLIENT_URL || 'http://localhost:3000',
}