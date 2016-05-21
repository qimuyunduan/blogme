var _            = require('lodash'),
	getFileNames = require('./getFileNames'),
	moment       = require('./moment'),
	checkUser    = require('./userPassService'),
	filters      = require('./filter'),
	postProcess  = require('./postProcess'),
    utils,
    getRandomInt;


getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

utils = {
    /**
     * Timespans in seconds and milliseconds for better readability
     */
    ONE_HOUR_S:          3600,
    ONE_DAY_S:          86400,
    ONE_YEAR_S:      31536000,
    ONE_HOUR_MS:      3600000,
    ONE_DAY_MS:      86400000,
    ONE_WEEK_MS:    604800000,
    ONE_MONTH_MS:  2628000000,
    ONE_YEAR_MS:  31536000000,

	//utils functions
	getFileNames:getFileNames,
	moment:moment,
	checkUser:checkUser,
	filters:filters,
	postProcess:postProcess,
    safeString: function (string, options) {
        options = options || {};

        // Replace URL reserved chars: `@:/?#[]!$&()*+,;=` as well as `\%<>|^~£"{}` and \`
        string = string.replace(/(\s|\.|@|:|\/|\?|#|\[|\]|!|\$|&|\(|\)|\*|\+|,|;|=|\\|%|<|>|\||\^|~|"|\{|\}|`|–|—)/g, '-')
            // Remove apostrophes
            .replace(/'/g, '')
            // Make the whole thing lowercase
            .toLowerCase();

        // We do not need to make the following changes when importing data
        if (!_.has(options, 'importing') || !options.importing) {
            // Convert 2 or more dashes into a single dash
            string = string.replace(/-+/g, '-')
                // Remove trailing dash
                .replace(/-$/, '')
                // Remove any dashes at the beginning
                .replace(/^-/, '');
        }

        // Handle whitespace at the beginning or end.
        string = string.trim();

        return string;
    },
    // The token is encoded URL safe by replacing '+' with '-', '\' with '_' and removing '='
    // NOTE: the token is not encoded using valid base64 anymore
    encodeBase64URLsafe: function (base64String) {
        return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    },
    // Decode url safe base64 encoding and add padding ('=')
    decodeBase64URLsafe: function (base64String) {
        base64String = base64String.replace(/-/g, '+').replace(/_/g, '/');
        while (base64String.length % 4) {
            base64String += '=';
        }
        return base64String;
    },
    redirect301: function redirect301(res, path) {

        res.set({'Cache-Control': 'public, max-age=' + utils.ONE_YEAR_S});
        res.redirect(301, path);
    }


};

module.exports = utils;
