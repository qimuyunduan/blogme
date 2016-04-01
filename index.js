
var express,
    blogme,
    parentApp,
    errors;

// Make sure dependencies are installed and file system permissions are correct.
require('./core/server/utils/startup-check').check();

// Proceed with startup
express = require('express');
blogme = require('./core');
errors = require('./core/server/errors');

// Create our parent express app instance.
parentApp = express();

//  get an instance of AppServer
blogme().then(function (ghostServer) {
    // Mount our  instance on our desired subdirectory path if it exists.
    parentApp.use(ghostServer.config.paths.subdir, ghostServer.rootApp);

    //  starting our server instance.
    ghostServer.start(parentApp);
}).catch(function (err) {
    errors.logErrorAndExit(err, err.context, err.help);
});
