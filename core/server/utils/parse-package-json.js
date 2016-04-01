/**
 * Dependencies
 */

var Promise = require('bluebird'),
    fs = require('fs'),

    readFile = Promise.promisify(fs.readFile);

/**
 * Parse package.json and validate it has
 * all the required fields
 */

function parsePackageJson(path) {
    return readFile(path)
        .catch(function () {
            var err = new Error('errors.utils.parsepackagejson.couldNotReadPackage');
            err.context = path;

            return Promise.reject(err);
        })
        .then(function (source) {
            var hasRequiredKeys, json, err;

            try {
                json = JSON.parse(source);

                hasRequiredKeys = json.name && json.version;

                if (!hasRequiredKeys) {
                    err = new Error('errors.utils.parsepackagejson.nameOrVersionMissing');
                    err.context = path;
                    err.help = 'errors.utils.parsepackagejson.willBeRequired';

                    return Promise.reject(err);
                }

                return json;
            } catch (parseError) {
                err = new Error('errors.utils.parsepackagejson.themeFileIsMalformed');
                err.context = path;
                err.help = 'errors.utils.parsepackagejson.willBeRequired';

                return Promise.reject(err);
            }
        });
}

/**
 * Expose `parsePackageJson`
 */

module.exports = parsePackageJson;
