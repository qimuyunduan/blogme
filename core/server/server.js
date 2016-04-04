// #  Server

var Promise = require('bluebird'),
    chalk = require('chalk'),
    fs = require('fs'),
    errors = require('./errors'),
    config = require('./config');

/**
 * ## Server
 * @constructor
 * @param {Object} rootApp - parent express instance
 */
function Server(app) {

	// frontend app(for user)
    this.app = app;
    this.httpServer = null;
    this.connections = {};
    this.connectionId = 0;

    // Expose config module for use externally.
    this.config = config;
}


Server.prototype.start = function (externalApp) {

    var self = this,
        rootApp = externalApp ? externalApp : self.app;

    return new Promise(function (resolve) {

        var socketConfig = config.getSocket();

        if (socketConfig) {
            // Make sure the socket is gone before trying to create another
            try {
                fs.unlinkSync(socketConfig.path);
            } catch (e) {
                // We can ignore this.
            }

            self.httpServer = rootApp.listen(socketConfig.path);

            fs.chmod(socketConfig.path, socketConfig.permissions);
        } else {
            self.httpServer = rootApp.listen(
                config.server.port,
                config.server.host
            );
        }

        self.httpServer.on('error', function (error) {
            if (error.errno === 'EADDRINUSE') {
                errors.logError(
                    'errors.httpServer.addressInUse.error',
                    'errors.httpServer.addressInUse.context',
                    'errors.httpServer.addressInUse.help'
                );
            } else {
                errors.logError(
                    'errors.httpServer.otherError.error',
                    'errors.httpServer.otherError.context',
                    'errors.httpServer.otherError.help'
                );
            }
            process.exit(-1);
        });
        self.httpServer.on('connection', self.connection.bind(self));
        self.httpServer.on('listening', function () {
            self.logStartMessages();
            resolve(self);
        });
    });
};


Server.prototype.stop = function () {
    var self = this;

    return new Promise(function (resolve) {
        if (self.httpServer === null) {
            resolve(self);
        } else {
            self.httpServer.close(function () {
                self.httpServer = null;
                self.logShutdownMessages();
                resolve(self);
            });

            self.closeConnections();
        }
    });
};

Server.prototype.restart = function () {
    return this.stop().then(this.start.bind(this));
};

Server.prototype.connection = function (socket) {
    var self = this;

    self.connectionId += 1;
    socket._APPId = self.connectionId;

    socket.on('close', function () {
        delete self.connections[this._APPId];
    });

    self.connections[socket._APPId] = socket;
};

/**
 * ### Close Connections
 * httpServer from returning. We need to destroy all connections manually.
 */
Server.prototype.closeConnections = function () {
    var self = this;

    Object.keys(self.connections).forEach(function (socketId) {
        var socket = self.connections[socketId];

        if (socket) {
            socket.destroy();
        }
    });
};

/**
 * ### Log Start Messages
 */
Server.prototype.logStartMessages = function () {
    // Startup & Shutdown messages
    if (process.env.NODE_ENV === 'production') {
        console.log(
            chalk.green('notices.httpServer.APPIsRunningIn'),
            chalk.gray('notices.httpServer.ctrlCToShutDown')
        );
    } else {
        console.log(
            chalk.green('notices.httpServer.APPIsRunningIn'),
           'notices.httpServer.listeningOn',
            config.getSocket() || config.server.host + ':' + config.server.port,
            'notices.httpServer.urlConfiguredAs',
            chalk.gray('notices.httpServer.ctrlCToShutDown')
        );
    }

    function shutdown() {
        console.log(chalk.red('notices.httpServer.APPHasShutdown'));
        if (process.env.NODE_ENV === 'production') {
            console.log(
                'notices.httpServer.yourAPPIsNowOffline'
            );
        } else {
            console.log(
                'notices.httpServer.APPWasRunningFor',
                Math.round(process.uptime()),
                'common.time.seconds'
            );
        }
        process.exit(0);
    }
    // ensure that App exits correctly on Ctrl+C and SIGTERM
    process.
        removeAllListeners('SIGINT').on('SIGINT', shutdown).
        removeAllListeners('SIGTERM').on('SIGTERM', shutdown);
};

/**
 * ### Log Shutdown Messages
 */
Server.prototype.logShutdownMessages = function () {
    console.log(chalk.red('notices.httpServer.IsClosingConnections'));
};

module.exports = Server;
