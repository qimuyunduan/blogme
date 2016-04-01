/**
 * Dependencies
 */

var readThemes = require('./read-themes'),
    Promise = require('bluebird'),
    _ = require('lodash');

/**
 * Validate themes:
 *
 *   1. Check if theme has package.json
 */

function validateThemes(dir) {
    var result = {
        warnings: [],
        errors: []
    };

    return readThemes(dir)
        .tap(function (themes) {
            _.each(themes, function (theme, name) {
                var hasPackageJson, warning;

                hasPackageJson = theme['package.json'] !== undefined;

                if (!hasPackageJson) {
                    warning = {
                        message: 'errors.utils.validatethemes.themeWithNoPackage.message',
                        context: 'errors.utils.validatethemes.themeWithNoPackage.context',
                        help: 'errors.utils.validatethemes.themeWithNoPackage.help'
                    };

                    result.warnings.push(warning);
                }

                // if package.json is `null`, it means that it exists
                // but JSON.parse failed (invalid json syntax)
                if (hasPackageJson && theme['package.json'] === null) {
                    warning = {
                        message: 'errors.utils.validatethemes.malformedPackage.message',
                        context: 'errors.utils.validatethemes.malformedPackage.context',
                        help: 'errors.utils.validatethemes.malformedPackage.help'
                    };

                    result.warnings.push(warning);
                }
            });
        })
        .then(function () {
            var hasNotifications = result.warnings.length || result.errors.length;

            if (hasNotifications) {
                return Promise.reject(result);
            }
        });
}

/**
 * Expose `validateThemes`
 */

module.exports = validateThemes;
