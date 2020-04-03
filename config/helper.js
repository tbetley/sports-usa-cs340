function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        return res.redirect("/login");
    }
};

function isAdminLoggedIn(req, res, next) {
    if (req.isAuthenticated() && req.session.isAdmin) {
        return next();
    }
    else {
        console.log("Unauthorized attempt to access admin panel");
        return res.redirect("/login");
    }
}

module.exports.isLoggedIn = isLoggedIn;
module.exports.isAdminLoggedIn = isAdminLoggedIn;