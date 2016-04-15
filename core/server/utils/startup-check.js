var packages = require('../../../package.json'),
    path     = require('path'),
    crypto   = require('crypto'),
    fs       = require('fs'),
    mode     = process.env.NODE_ENV === undefined ? 'development' : process.env.NODE_ENV,
    appRoot  = path.resolve(__dirname, '../../../'),
    configFilePath = path.join(appRoot, 'config.js'),
    checks,
    exitCodes      = {
        NODE_ENV_CONFIG_MISSING: 232,
        DEPENDENCIES_MISSING: 233,
        CONTENT_PATH_NOT_ACCESSIBLE: 234,
        CONTENT_PATH_NOT_WRITABLE: 235,
        MYSQL_DB_NOT_WRITABLE: 236
    };

checks = {
    check: function check() {
        this.nodeEnv();
        this.packages();
        this.contentPath();
        this.mail();
        this.mysql();
    },

    nodeEnv: function checkNodeEnvState() {
        // Check if config path resolves, if not check for NODE_ENV in config.example.js prior to copy
        var fd,
            configFile,
            config;

        try {
            fd = fs.openSync(configFilePath, 'r');
            fs.closeSync(fd);
        } catch (e) {
            configFilePath = path.join(appRoot, 'config.example.js');
        }

        configFile = require(configFilePath);
        config = configFile[mode];

        if (!config) {
            console.error('\x1B[31mERROR: Cannot find the configuration for the current NODE_ENV: ' +
                            process.env.NODE_ENV + '\033[0m\n');
            console.error('\x1B[32mEnsure the config.js has a section for the current NODE_ENV value' +
                            ' and is formatted properly.\033[0m');

            process.exit(exitCodes.NODE_ENV_CONFIG_MISSING);
        }
    },

    // Make sure package.json dependencies have been installed.
    packages: function checkPackages() {
        if (mode !== 'production' && mode !== 'development') {
            return;
        }

        var errors = [];

        Object.keys(packages.dependencies).forEach(function (p) {
            try {
                require.resolve(p);
            } catch (e) {
                errors.push(e.message);
            }
        });

        if (!errors.length) {
            return;
        }

        errors = errors.join('\n  ');

        console.error('\x1B[31mERROR: unable to start due to missing dependencies:\033[0m\n  ' + errors);
        console.error('\x1B[32m\nPlease run `npm install --production` and try starting APP again.');


        process.exit(exitCodes.DEPENDENCIES_MISSING);
    },

    // Check content path permissions
    contentPath: function checkContentPaths() {
        if (mode !== 'production' && mode !== 'development') {
            return;
        }

        var configFile,
            config,
            contentPath,
            contentSubPaths = [ 'data', 'images'],
            fd,
            errorHeader = '\x1B[31mERROR: Unable to access app content path:\033[0m',
            errorHelp = '\x1B[32mCheck that the content path exists and file system permissions are correct.' ;

        // Get the content path to test.  If it's defined in config.js use that, if not use the default
        try {
            configFile = require(configFilePath);
            config = configFile[mode];

            if (config && config.paths && config.paths.contentPath) {
                contentPath = config.paths.contentPath;
            } else {
                contentPath = path.join(appRoot, 'content');
            }
        } catch (e) {
            // If config.js doesn't exist yet, check the default content path location
            contentPath = path.join(appRoot, 'content');
        }

        // Use all sync io calls so that we stay in this function until all checks are complete

        // Check the root content path
        try {
            fd = fs.openSync(contentPath, 'r');
            fs.closeSync(fd);
        } catch (e) {
            console.error(errorHeader);
            console.error('  ' + e.message);
            console.error('\n' + errorHelp);

            process.exit(exitCodes.CONTENT_PATH_NOT_ACCESSIBLE);
        }

        // Check each of the content path subdirectories
        try {
            contentSubPaths.forEach(function (sub) {
                var dir = path.join(contentPath, sub),
                    randomFile = path.join(dir, crypto.randomBytes(8).toString('hex'));

                fd = fs.openSync(dir, 'r');
                fs.closeSync(fd);

                // Check write access to directory by attempting to create a random file
                fd = fs.openSync(randomFile, 'wx+');
                fs.closeSync(fd);
                fs.unlinkSync(randomFile);
            });
        } catch (e) {
            console.error(errorHeader);
            console.error('  ' + e.message);
            console.error('\n' + errorHelp);
            process.exit(exitCodes.CONTENT_PATH_NOT_WRITABLE);
        }
    },

    // Make sure mysql database is available for read/write
    mysql: function checkMysql() {
        if (mode !== 'production' && mode !== 'development') {
            return;
        }

        var configFile,
            config;

        try {
            configFile = require(configFilePath);
            config = configFile[mode];

            // Abort check if database type is not mysql
            if (config && config.database && config.database.client !== 'mysql') {
                return;
            }

        } catch (e) {
			console.error('mysql is not set correctly');
			process.exit(exitCodes.MYSQL_DB_NOT_WRITABLE);
        }

    },

    mail: function checkMail() {
        var configFile,
            config;

        try {
            configFile = require(configFilePath);
            config = configFile[mode];
        } catch (e) {
            configFilePath = path.join(appRoot, 'config.js');
        }

        if (!config.mail || !config.mail.transport) {
            console.error('\x1B[31mWARNING: App attempting to use a direct method to send email. \nIt is recommended that you explicitly configure an email service.\033[0m');

        }
    }
};

module.exports = checks;
