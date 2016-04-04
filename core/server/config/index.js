// # Config
// General entry point for all configuration data
var path          = require('path'),
    Promise       = require('bluebird'),
    chalk         = require('chalk'),
    crypto        = require('crypto'),
    fs            = require('fs'),
    url           = require('url'),
    _             = require('lodash'),
    validator     = require('validator'),
    errors        = require('../errors'),
    packageInfo   = require('../../../package.json'),
    appRoot       = path.resolve(__dirname, '../../../'),
    corePath      = path.resolve(appRoot, 'core/'),
    defaultConfig = {};

function ConfigManager(config) {

    this._config = {};

    // If we're given an initial config object then we can set it.
    if (config && _.isObject(config)) {
        this.set(config);
    }
}

module.exports = new ConfigManager(defaultConfig);
