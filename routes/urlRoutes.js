// routes/urlRoutes.js
const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middlewares/authMiddlewares");

const {
  Shorten,
  Redirect,
  GetUserUrls,
  DeleteUrl,
} = require("../controllers/urlController");

router.route("/shorten").post(isAuthenticatedUser, Shorten);

router.route("/:shortUrl").get(isAuthenticatedUser, Redirect);

router.route("/").get(isAuthenticatedUser, GetUserUrls);

router.route("/:id").delete(isAuthenticatedUser, DeleteUrl);

module.exports = router;
