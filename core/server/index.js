// Module dependencies
var express     = require('express'),
    hbs         = require('express-hbs'),
    compress    = require('compression'),
    uuid        = require('node-uuid'),
    Promise     = require('bluebird'),
	path        = require('path'),
    api         = require('./api'),
    config      = require('./config'),
    helpers     = require('./helpers'),
    middleware  = require('./middleware'),
    models      = require('./models'),
    permissions = require('./permissions'),

    Server      = require('./app_server');


// Sets up the express server instances, runs init on a bunch of stuff, configures views, helpers, routes and more
// Finally it returns an instance of Server
function init(options) {
    // Get reference to an express app instance.
    var app = express();

    // It returns a promise that is resolved when the application
    // Load our config.js file from the local file system.

    return Promise.resolve().then(function () {
    //    // Initialise the models
    //    return models.init();
    //}).then(function () {
    //    // Initialize the settings cache
    //    return api.init();
    //}).then(function () {
    //    return permissions.init();
    //}).then(function () {
        var Hbs = hbs.create();
        // enabled gzip compression by default
		app.use(compress());


		// set view path
		app.set('views',path.join(__dirname,'/views/hbs/'));
		// set the view engine
		app.set('view engine', 'hbs');
		app.engine('hbs', Hbs.express4({}));
        //// Load helpers
        //helpers.loadCoreHelpers(Hbs);
		//
        //// Middleware and Routing
        middleware(app);

        return new Server(app);
    //});
    });
}
module.exports = init;
