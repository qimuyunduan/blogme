/**
 * Dependencies
 */

var Promise = require('bluebird'),
    _ = require('lodash'),

    exports,
    models;

/**
 * Expose all models
 */

exports = module.exports;

models = [
    'accesstokens',
    'addmoney-record-detail',
    'app-fields',
    'app-settings',
    'app-version',
    'apps'
];

function init() {
    exports.Base = require('./base');

    models.forEach(function (name) {
		
        _.extend(exports, require('./'+name));
    });

    return Promise.resolve();
}

/**
 * Expose `init`
 */

//exports.init = init;
init();
