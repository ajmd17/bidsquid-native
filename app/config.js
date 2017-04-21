import { Platform } from 'react-native';

module.exports = {
  API_SERVER_URL: 'http://bidsquid.ca:8081',/*process.env.NODE_ENV == 'production'
    ? 'http://bidsquid.ca:8081'
    : 'http://localhost:9001',*/

  DEFAULT_FONT: Platform.OS == 'ios'
    ? 'Futura'
    : 'sans-serif'
};