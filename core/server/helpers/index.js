var hbs             = require('express-hbs'),
    Promise         = require('bluebird'),
    errors          = require('../errors'),
    utils           = require('./utils'),
    coreHelpers     = {},
    registerHelpers;

if (!utils.isProduction) {
    hbs.handlebars.logger.level = 0;
}



coreHelpers.body_class  = require('./body_class');
coreHelpers.content  = require('./content');
coreHelpers.date  = require('./date');
coreHelpers.encode  = require('./encode');
coreHelpers.foreach = require('./foreach');
coreHelpers.image = require('./image');
coreHelpers.is = require('./is');
coreHelpers.has = require('./has');



// Specialist helpers for certain templates
coreHelpers.input_password = require('./input_password');

coreHelpers.helperMissing = function (arg) {
    if (arguments.length === 2) {
        return undefined;
    }
    errors.logError('warnings.helpers.index.missingHelper');
};

// Register an async handlebars helper for a given handlebars instance
function registerAsyncHelper(hbs, name, fn) {
    hbs.registerAsyncHelper(name, function (context, options, cb) {
        // Handle the case where we only get context and cb
        if (!cb) {
            cb = options;
            options = undefined;
        }

        // Wrap the function passed in with a when.resolve so it can return either a promise or a value
        Promise.resolve(fn.call(this, context, options)).then(function (result) {
            cb(result);
        }).catch(function (err) {
            errors.logAndThrowError(err, 'registerAsyncThemeHelper: ' + name);
        });
    });
}

// Register a handlebars helper for themes
function registerThemeHelper(name, fn) {
    hbs.registerHelper(name, fn);
}

// Register an async handlebars helper for themes
function registerAsyncThemeHelper(name, fn) {
    registerAsyncHelper(hbs, name, fn);
}

// Register a handlebars helper for admin
function registerAdminHelper(name, fn) {
    coreHelpers.adminHbs.registerHelper(name, fn);
}

registerHelpers = function (adminHbs) {
    // Expose hbs instance for admin
    coreHelpers.adminHbs = adminHbs;

    // Register helpers

    registerThemeHelper('body_class', coreHelpers.body_class);
    registerThemeHelper('content', coreHelpers.content);
    registerThemeHelper('date', coreHelpers.date);
    registerThemeHelper('encode', coreHelpers.encode);
    registerThemeHelper('foreach', coreHelpers.foreach);
    registerThemeHelper('has', coreHelpers.has);
    registerThemeHelper('is', coreHelpers.is);
    registerThemeHelper('image', coreHelpers.image);
    registerThemeHelper('input_password', coreHelpers.input_password);
    registerAdminHelper('input_password', coreHelpers.input_password);
};

module.exports = coreHelpers;
module.exports.loadCoreHelpers = registerHelpers;
module.exports.registerThemeHelper = registerThemeHelper;
module.exports.registerAsyncThemeHelper = registerAsyncThemeHelper;
