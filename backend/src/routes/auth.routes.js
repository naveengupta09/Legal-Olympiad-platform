const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const ctrl = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const { authLimiter } = require("../middleware/rateLimit.middleware");
const { validate } = require("../middleware/validate.middleware");
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
} = require("../validators/auth.validator");
const { ENV } = require("../config/env");

const googleOAuthConfigured =
	process.env.GOOGLE_CLIENT_ID &&
	process.env.GOOGLE_CLIENT_SECRET &&
	process.env.GOOGLE_CALLBACK_URL;

const githubOAuthConfigured =
	process.env.GITHUB_CLIENT_ID &&
	process.env.GITHUB_CLIENT_SECRET &&
	process.env.GITHUB_CALLBACK_URL;

router.post("/register", authLimiter, registerValidator, validate, ctrl.register);
router.post("/login",    authLimiter, loginValidator, validate, ctrl.login);
router.post("/logout",   protect,     ctrl.logout);
router.get ("/me",       protect,     ctrl.getMe);
router.get ("/verify-email",          ctrl.verifyEmail);
router.post("/forgot-password", authLimiter, forgotPasswordValidator, validate, ctrl.forgotPassword);
router.post("/reset-password", authLimiter, resetPasswordValidator, validate, ctrl.resetPassword);
router.patch("/change-password", protect, changePasswordValidator, validate, ctrl.changePassword);

if (googleOAuthConfigured) {
	router.get(
		"/google",
		passport.authenticate("google", { scope: ["profile", "email"], session: false })
	);

	router.get(
		"/google/callback",
		passport.authenticate("google", {
			failureRedirect: `${ENV.CLIENT_URL}/login?error=google`,
			session: false,
		}),
		ctrl.oauthCallback("google")
	);
} else {
	router.get("/google", (req, res) => {
		res.status(503).json({ success: false, message: "Google OAuth is not configured on this server", errors: [] });
	});

	router.get("/google/callback", (req, res) => {
		res.redirect(`${ENV.CLIENT_URL}/login?error=google`);
	});
}

if (githubOAuthConfigured) {
	router.get(
		"/github",
		passport.authenticate("github", { scope: ["user:email"], session: false })
	);

	router.get(
		"/github/callback",
		passport.authenticate("github", {
			failureRedirect: `${ENV.CLIENT_URL}/login?error=github`,
			session: false,
		}),
		ctrl.oauthCallback("github")
	);
} else {
	router.get("/github", (req, res) => {
		res.status(503).json({ success: false, message: "GitHub OAuth is not configured on this server", errors: [] });
	});

	router.get("/github/callback", (req, res) => {
		res.redirect(`${ENV.CLIENT_URL}/login?error=github`);
	});
}

module.exports = router;