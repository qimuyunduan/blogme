var Promise = require('bluebird'),
	chalk   = require('chalk'),
	fs      = require('fs'),
	errors  = require('./errors'),
	config  = require('./config');


function Server(rootApp) {
	this.rootApp = rootApp;
	this.httpServer = null;
	this.connections = {};
	this.connectionId = 0;

	// Expose config module for use externally.
	this.config = config;
}


Server.prototype.start = function () {
	var self    = this,
		rootApp = self.rootApp;

	return new Promise(function (resolve) {
		//TODO 添加监听端口
		self.httpServer = rootApp.listen(
				config.server.port,
				config.server.host
		);
		self.httpServer.on('error', function (error) {
			if (error.errno === 'EADDRINUSE') {
				errors.logError(
					'errors.httpServer.addressInUse.error'
					
				);
			} else {
				errors.logError(
					'errors.httpServer.otherError.error'
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

/**
 * ### Stop
 * Returns a promise that will be fulfilled when the server stops. If the server has not been started,
 * the promise will be fulfilled immediately
 * @returns {Promise} Resolves once Ghost has stopped
 */
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

/**
 * ### Restart
 * Restarts the  application
 * @returns {Promise} Resolves once APP has restarted
 */
Server.prototype.restart = function () {
	return this.stop().then(this.start.bind(this));
};


Server.prototype.connection = function (socket) {
	var self = this;

	self.connectionId += 1;
	socket._Id = self.connectionId;

	socket.on('close', function () {
		delete self.connections[this._Id];
	});

	self.connections[socket._Id] = socket;
};

/**
 * ### Close Connections
 * Most browsers keep a persistent connection open to the server, which prevents the close callback of
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
			chalk.green('notices.httpServer.appIsRunningIn'),
			chalk.gray('notices.httpServer.ctrlCToShutDown')
		);
	} else {
		console.log(
			chalk.green('notices.httpServer.appIsRunningIn'),
			'notices.httpServer.listeningOn',
			config.getSocket() || config.server.host + ':' + config.server.port,
			chalk.gray('notices.httpServer.ctrlCToShutDown')
		);
	}

	function shutdown() {
		console.log(chalk.red('notices.httpServer.appHasShutdown'));
		if (process.env.NODE_ENV === 'production') {
			console.log(
				'notices.httpServer.yourAppIsNowOffline'
			);
		} else {
			console.log(
				'notices.httpServer.appWasRunningFor',
				Math.round(process.uptime()),
				'common.time.seconds'
			);
		}
		process.exit(0);
	}
	process.
	removeAllListeners('SIGINT').on('SIGINT', shutdown).
	removeAllListeners('SIGTERM').on('SIGTERM', shutdown);
};

/**
 * ### Log Shutdown Messages
 */
Server.prototype.logShutdownMessages = function () {
	console.log(chalk.red('notices.httpServer.appIsClosingConnections'));
};

module.exports = Server;
