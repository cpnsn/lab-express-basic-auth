const router = require("express").Router();
const User = require("./../models/User.model");
const bcrypt = require("bcryptjs");
const salt = 12;

const { isLoggedIn, isLoggedOut } = require("../middlewares/middlewares");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.get("/main", isLoggedOut, (req, res, next) => {
  res.render("/main");
});

router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("/private");
});

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.render("auth/signup", {
        errorMessage: "You must fill both fields",
      });
    }

    const foundUser = await User.findOne({ username });

    if (foundUser) {
      return res.render("auth/signup", {
        errorMessage: "Username already exists",
      });
    }

    const generatedSalt = await bcrypt.genSalt(salt);
    const hashedPassword = await bcrypt.hash(password, generatedSalt);

    const newUser = await User.create({
      username,
      password: hashedPassword,
    });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.render("auth/login", {
        errorMessage: "You must fill both fields",
      });
    }
    const foundUser = await User.findOne({ username });

    if (!foundUser) {
      return res.render("auth/login", {
        errorMessage: "Wrong credentials",
      });
    }

    const samePassword = await bcrypt.compare(password, foundUser.password);

    if (!samePassword) {
      return res.render("auth/login", {
        errorMessage: "Wrong credentials",
      });
    }

    req.session.currentUser = foundUser;

    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

router.get("/logout", async (req, res, next) => {
  await req.session.destroy();
  res.redirect("/auth/login");
});

module.exports = router;
