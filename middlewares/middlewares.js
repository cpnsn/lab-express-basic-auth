function isLoggedIn(req, res, next) {
  if (!req.session.currentUser) {
    return res.redirect("/auth/login");
  }
  next();
}

function isLoggedOut(req, res, next) {
  if (req.session.currentUser) {
    res.redirect("/");
  }
  next();
}

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
