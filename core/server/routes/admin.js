var admin       = require('../controllers/admin'),
    express     = require('express'),

    adminRoutes;

adminRoutes = function () {
    var router = express.Router();

    router.get('/admin', admin.index);

    return router;
};

module.exports = adminRoutes;
