var environment = process.env.NODE_ENV || 'development';
var configuration = require('../knexfile.js')[environment];

module.exports = require('knex')(configuration);