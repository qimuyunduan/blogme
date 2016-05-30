 // Module dependencies
var express     = require('express'),
    hbs         = require('express-hbs'),
    compress    = require('compression'),
    uuid        = require('node-uuid'),
    Promise     = require('bluebird'),
	path        = require('path'),
    api         = require('./api'),
    helpers     = require('./helpers'),
    middleware  = require('./middleware'),
    permissions = require('./permissions'),
    Server      = require('./app_server');


// Sets up the express server instances, runs init on a bunch of stuff, configures views, helpers, routes and more
// Finally it returns an instance of Server
function init() {
    // Get reference to an express app instance.
    var app = express();

    return Promise.resolve().then(function () {
        // Initialize the settings cache
        //return api.init();

    //}).then(function () {

		//TODO:init permission
        //return permissions.init();
    //}).then(function () {

        var Hbs = hbs.create();
        // enabled gzip compression by default
		app.use(compress());

		// set view path
		app.set('views',path.join(__dirname,'/views'));
		// set the view engine
		app.set('view engine', 'html');
		app.engine('html', Hbs.express4({
			partialsDir: path.join(__dirname,'/views/partials')
		}));
         //Load helpers
        helpers.loadCoreHelpers(Hbs);

        //// Middleware and Routing
        middleware(app);

        return new Server(app);
    //});
    });
}
module.exports = init;
