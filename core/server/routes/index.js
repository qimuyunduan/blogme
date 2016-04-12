var api         = require('./api'),
    admin       = require('./admin'),
    frontend    = require('./frontend');

module.exports = {
    apiBaseUri: '/',
    api: api,
    admin: admin,
    frontend: frontend
};
