const axios = require('axios');

// const baseURL = 'http://localhost:8081/api';
const baseURL = 'http://200.52.220.238:72/api';

const hieleraApi = axios.create({ baseURL });

hieleraApi.interceptors.request.use( ( config ) => {
  config.headers['x-auth'] = process.env.SECRETAUTHKEY;

  return config;
});

module.exports = hieleraApi;