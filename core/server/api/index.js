// # App Data API
var _              = require('lodash'),
    config         = require('../config'),
    mail           = require('./mail'),
    settings       = require('./settings'),
    authentication = require('./authentication'),
    uploads        = require('./upload'),
    http,
    addHeaders,
    cacheInvalidationHeader,
    locationHeader,
    contentDispositionHeader,
    init;


init = function init() {
    return settings.updateSettingsCache();
};


cacheInvalidationHeader = function cacheInvalidationHeader(req, result) {
    var parsedUrl = req._parsedUrl.pathname.replace(/^\/|\/$/g, '').split('/'),
        method = req.method,
        endpoint = parsedUrl[0],
        cacheInvalidate,
        jsonResult = result.toJSON ? result.toJSON() : result,
        post,
        hasStatusChanged,
        wasDeleted,
        wasPublishedUpdated;

    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        if (endpoint === 'settings' || endpoint === 'users' || endpoint === 'db' || endpoint === 'tags') {
            cacheInvalidate = '/*';
        } else if (endpoint === 'posts') {
            post = jsonResult.posts[0];
            hasStatusChanged = post.statusChanged;
            wasDeleted = method === 'DELETE';
            // Invalidate cache when post was updated but not when post is draft
            wasPublishedUpdated = method === 'PUT' && post.status === 'published';

            // Remove the statusChanged value from the response
            delete post.statusChanged;

            // Don't set x-cache-invalidate header for drafts
            if (hasStatusChanged || wasDeleted || wasPublishedUpdated) {
                cacheInvalidate = '/*';
            } else {
                cacheInvalidate = '/' + config.routeKeywords.preview + '/' + post.uuid + '/';
            }
        }
    }

    return cacheInvalidate;
};



/**
 * ### Content Disposition Header
 * create a header that invokes the 'Save As' dialog in the browser when exporting the database to file. The 'filename'
 * parameter is governed by [RFC6266](http://tools.ietf.org/html/rfc6266#section-4.3).
 *
 * For encoding whitespace and non-ISO-8859-1 characters, you MUST use the "filename*=" attribute, NOT "filename=".
 * Ideally, both. Examples: http://tools.ietf.org/html/rfc6266#section-5
 *
 * We'll use ISO-8859-1 characters here to keep it simple.
 *
 * @private
 * @see http://tools.ietf.org/html/rfc598
 * @return {string}
 */
contentDispositionHeader = function contentDispositionHeader() {
    return dataExport.fileName().then(function then(filename) {
        return 'Attachment; filename="' + filename + '"';
    });
};

addHeaders = function addHeaders(apiMethod, req, res, result) {
    var cacheInvalidation,
        location,
        contentDisposition;

    cacheInvalidation = cacheInvalidationHeader(req, result);
    if (cacheInvalidation) {
        res.set({'X-Cache-Invalidate': cacheInvalidation});
    }

    if (req.method === 'POST') {
        location = locationHeader(req, result);
        if (location) {
            res.set({Location: location});
            // The location header indicates that a new object was created.
            // In this case the status code should be 201 Created
            res.status(201);
        }
    }

    if (apiMethod === db.exportContent) {
        contentDisposition = contentDispositionHeader()
            .then(function addContentDispositionHeader(header) {
                // Add Content-Disposition Header
                if (apiMethod === db.exportContent) {
                    res.set({
                        'Content-Disposition': header
                    });
                }
            });
    }

    return contentDisposition;
};

/**
 * ### HTTP
 *
 * Decorator for API functions which are called via an HTTP request. Takes the API method and wraps it so that it gets
 * data from the request and returns a sensible JSON response.
 *
 * @public
 * @param {Function} apiMethod API method to call
 * @return {Function} middleware format function to be called by the route when a matching request is made
 */
http = function http(apiMethod) {
    return function apiHandler(req, res, next) {
        // We define 2 properties for using as arguments in API calls:
        var object = req.body,
            options = _.extend({}, req.files, req.query, req.params, {
                context: {
                    user: (req.user && req.user.id) ? req.user.id : null
                }
            });

        // If this is a GET, or a DELETE, req.body should be null, so we only have options (route and query params)
        // If this is a PUT, POST, or PATCH, req.body is an object
        if (_.isEmpty(object)) {
            object = options;
            options = {};
        }

        return apiMethod(object, options).tap(function onSuccess(response) {
            // Add X-Cache-Invalidate, Location, and Content-Disposition headers
            return addHeaders(apiMethod, req, res, (response || {}));
        }).then(function then(response) {
            // Send a properly formatting HTTP response containing the data with correct headers
            res.json(response || {});
        }).catch(function onAPIError(error) {
            // To be handled by the API middleware
            next(error);
        });
    };
};

/**
 * ## Public API
 */
module.exports = {
    init: init,
    http: http,
    mail: mail,
    settings: settings,
    authentication: authentication,
    uploads: uploads
};


