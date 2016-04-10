var bodyParser       = require('body-parser'),
    config           = require('../config'),
    errors           = require('../errors'),
    express          = require('express'),
    logger           = require('morgan'),
    path             = require('path'),
    routes           = require('../routes'),
    slashes          = require('connect-slashes'),
    passport         = require('passport'),
    utils            = require('../utils'),
    authStrategies   = require('./auth-strategies'),
    busboy           = require('./ghost-busboy'),
    auth             = require('./auth'),
    cacheControl     = require('./cache-control'),
    decideIsAdmin    = require('./decide-is-admin'),
    oauth            = require('./oauth'),
    privateBlogging  = require('./private-blogging'),
    redirectToSetup  = require('./redirect-to-setup'),
    serveSharedFile  = require('./serve-shared-file'),
    spamPrevention   = require('./spam-prevention'),
    staticTheme      = require('./static-theme'),
    themeHandler     = require('./theme-handler'),
    uncapitalise     = require('./uncapitalise'),
    ClientPasswordStrategy  = require('passport-oauth2-client-password').Strategy,
    BearerStrategy          = require('passport-http-bearer').Strategy,

    middleware,
    setupMiddleware;



middleware = {
    busboy: busboy,
    cacheControl: cacheControl,
    spamPrevention: spamPrevention,
    privateBlogging: privateBlogging,
    oauth: oauth,
    api: {
        authenticateClient: auth.authenticateClient,
        authenticateUser: auth.authenticateUser,
        requiresAuthorizedUser: auth.requiresAuthorizedUser,
        requiresAuthorizedUserPublicAPI: auth.requiresAuthorizedUserPublicAPI,
        errorHandler: errors.handleAPIError
    }
};

setupMiddleware  = function setupMiddleware(App) {
    var logging  = config.logging,
        corePath = config.paths.corePath;

    passport.use(new ClientPasswordStrategy(authStrategies.clientPasswordStrategy));
    passport.use(new BearerStrategy(authStrategies.bearerStrategy));

    // Initialize OAuth middleware
    oauth.init();

    // Make sure 'req.secure' is valid for proxied requests
    // (X-Forwarded-Proto header will be checked, if present)
    App.enable('trust proxy');

    // Logging configuration
    if (logging !== false) {
        if (App.get('env') !== 'development') {
            App.use(logger('combined', logging));
        } else {
            App.use(logger('dev', logging));
        }
    }

    // Favicon
    App.use(serveSharedFile('favicon.ico', 'image/x-icon', utils.ONE_DAY_S));


    // Static assets
    App.use('/shared', express.static(path.join(corePath, '/shared'), {maxAge: utils.ONE_HOUR_MS}));
    App.use('/public', express.static(path.join(corePath, '/built/public'), {maxAge: utils.ONE_YEAR_MS}));

    // First determine whether we're serving admin or theme content
    App.use(decideIsAdmin);
    App.use(themeHandler.updateActiveTheme);
    App.use(themeHandler.configHbsForContext);

    // Admin only config
    App.use('/admin', express.static(config.paths.clientAssets, {maxAge: utils.ONE_YEAR_MS}));

    // Force SSL
    // NOTE: Importantly this is _after_ the check above for admin-theme static resources,
    //       which do not need HTTPS. In fact, if HTTPS is forced on them, then 404 page might
    //       not display properly when HTTPS is not available!
    App.use(checkSSL);

    // Theme only config
    App.use(staticTheme());

    // Check if password protected app
    App.use(privateBlogging.checkIsPrivate); // check if the app is protected
    App.use(privateBlogging.filterPrivateRoutes);


    // site map
    sitemapHandler(App);

    // Add in all trailing slashes
    App.use(slashes(true, {
        headers: {
            'Cache-Control': 'public, max-age=' + utils.ONE_YEAR_S
        }
    }));
    App.use(uncapitalise);

    // Body parsing
    App.use(bodyParser.json({limit: '1mb'}));
    App.use(bodyParser.urlencoded({extended: true, limit: '1mb'}));

    App.use(passport.initialize());

    // ### Caching

    App.use(cacheControl('public'));

    App.use(routes.apiBaseUri, cacheControl('private'));

    // local data
    App.use(themeHandler.ghostLocals);

    // ### Routing
    // Set up API routes
    App.use(routes.apiBaseUri, routes.api(middleware));

    // Set up Frontend routes
    App.use(routes.frontend(middleware));

    // ### Error handling
    // 404 Handler
    App.use(errors.error404);

    // 500 Handler
    App.use(errors.error500);
};

module.exports = setupMiddleware;

module.exports.middleware = middleware;
