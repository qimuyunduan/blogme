var appInit,
    errors;

     // Make sure dependencies are installed and file system permissions are correct.
require('./core/server/utils/startup-check').check();

appInit = require('./core');
errors  = require('./core/server/errors');

    //  get an instance of AppServer
appInit().then(function (server) {

    // starting our server instance.
    server.start();

}).catch(function (err) {
    errors.logErrorAndExit(err, err.context, err.help);
});
