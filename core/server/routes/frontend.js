var frontend    = require('../controllers/frontend'),
    channels    = require('../controllers/frontend/channels'),
    config      = require('../config'),
    express     = require('express'),
    utils       = require('../utils'),

    frontendRoutes;

frontendRoutes = function frontendRoutes(middleware) {

    var router = express.Router(),
        privateRouter = express.Router();

    // ### Admin routes
    router.get(/^\/(logout|signout)\/$/, function redirectToSignout(req, res) {
        utils.redirect301(res, subdir + '/ghost/signout/');
    });
    router.get(/^\/signup\/$/, function redirectToSignup(req, res) {
        utils.redirect301(res, subdir + '/ghost/signup/');
    });
    // password-protected frontend route
    privateRouter.route('/')
        .get(
            middleware.privateBlogging.isPrivateSessionAuth,
            frontend.private
        )
        .post(
            middleware.privateBlogging.isPrivateSessionAuth,
            middleware.spamPrevention.protected,
            middleware.privateBlogging.authenticateProtection,
            frontend.private
        );

    // Post Live Preview
    router.get('/' + routeKeywords.preview + '/:uuid', frontend.preview);

    // Private
    router.use('/' + routeKeywords.private + '/', privateRouter);

    // Channels
    router.use(channels.router());

    // Default
    router.get('*', frontend.single);

    return router;
};

module.exports = frontendRoutes;
