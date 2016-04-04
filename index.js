
var express,
	appInit,
    parentApp,
    errors;

// Make sure dependencies are installed and file system permissions are correct.
require('./core/server/utils/startup-check').check();

// Proceed with startup
express = require('express');
appInit = require('./core'); //加载./core/index.js
errors  = require('./core/server/errors');

// Create our parent express app instance.
parentApp = express();

//  get an instance of AppServer
appInit().then(function (server) {
    // Mount our  instance on our desired subdirectory path if it exists.
    parentApp.use(server.config.paths.subdir, server.rootApp);

    //  starting our server instance.
    server.start(parentApp);
}).catch(function (err) {
    errors.logErrorAndExit(err, err.context, err.help);
});
