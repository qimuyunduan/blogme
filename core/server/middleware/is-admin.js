// # DecideIsAdmin Middleware
// Usage: decideIsAdmin(request, result, next)
// Helper function to determine if its an admin page.

var decideIsAdmin;

decideIsAdmin = function decideIsAdmin(req, res, next) {

    res.isAdmin = req.url.lastIndexOf('/admin/', 0) === 0;
    next();
};

module.exports = decideIsAdmin;
