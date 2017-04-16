module.exports = {
  API_SERVER_URL: process.env.NODE_ENV == 'production'
    ? 'http://bidsquid.ca:8081'
    : 'http://localhost:9001',
};