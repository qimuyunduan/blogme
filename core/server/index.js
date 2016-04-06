// Module dependencies
var express     = require('express'),
    hbs         = require('express-hbs'),
    compress    = require('compression'),
    uuid        = require('node-uuid'),
    Promise     = require('bluebird'),
    api         = require('./api'),
    config      = require('./config'),
    helpers     = require('./helpers'),
    middleware  = require('./middleware'),
    models      = require('./models'),
    permissions = require('./permissions'),
    server      = require('./server'),
    dbHash;


// Sets up the express server instances, runs init on a bunch of stuff, configures views, helpers, routes and more
// Finally it returns an instance of Server
function init(options) {
    // Get reference to an express app instance.
    var app = express(),
        adminApp = express();

    // It returns a promise that is resolved when the application


    // Load our config.js file from the local file system.
    return config.load(options.config).then(function () {
        // Initialise the models
        return models.init();
    }).then(function () {
        // Populate any missing default settings
        return models.Settings.populateDefaults();
    }).then(function () {
        // Initialize the settings cache
        return api.init();
    }).then(function () {
        return permissions.init();
    }).then(function () {

        var adminHbs = hbs.create();
        // enabled gzip compression by default
        if (config.server.compress !== false) {
            app.use(compress());
        }

        // ## View engine
        // set the view engine
        app.set('view engine', 'hbs');

        // Create a hbs instance for admin and init view engine
        adminApp.set('view engine', 'hbs');
        adminApp.engine('hbs', adminHbs.express4({}));

        // Load helpers
        helpers.loadCoreHelpers(adminHbs);

        // Middleware and Routing
        middleware(app, adminApp);

        return new server(app);
    });
}

module.exports = init;
