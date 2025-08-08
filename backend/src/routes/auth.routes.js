/**
 * AUTH ROUTES - Authentication endpoints
 *
 * Features:
 * - User registration
 * - User login
 * - Password reset
 * - Token refresh
 */

const express = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { asyncHandler } = require("../middleware/error.middleware");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN || "7d",
	});
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
	"/register",
	[
		body("firstName")
			.trim()
			.isLength({ min: 2, max: 50 })
			.withMessage("First name must be between 2 and 50 characters"),
		body("lastName")
			.trim()
			.isLength({ min: 2, max: 50 })
			.withMessage("Last name must be between 2 and 50 characters"),
		body("email")
			.isEmail()
			.normalizeEmail()
			.withMessage("Please provide a valid email"),
		body("password")
			.isLength({ min: 6 })
			.withMessage("Password must be at least 6 characters long"),
		body("role")
			.optional()
			.isIn(["user", "admin", "manager"])
			.withMessage("Invalid role"),
	],
	asyncHandler(async (req, res) => {
		// Check for validation errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				message: "Validation failed",
				errors: errors.array(),
			});
		}

		const { firstName, lastName, email, password, role = "user" } = req.body;

		// Check if user already exists
		const existingUser = await User.findByEmail(email);
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User with this email already exists",
			});
		}

		// Create new user
		const user = new User({
			firstName,
			lastName,
			email,
			password,
			role,
		});

		await user.save();

		// Generate token
		const token = generateToken(user._id);

		// Update last login
		user.lastLogin = new Date();
		await user.save();

		res.status(201).json({
			success: true,
			message: "User registered successfully",
			data: {
				user: user.getPublicProfile(),
				token,
			},
		});
	})
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
	"/login",
	[
		body("email")
			.isEmail()
			.normalizeEmail()
			.withMessage("Please provide a valid email"),
		body("password").notEmpty().withMessage("Password is required"),
	],
	asyncHandler(async (req, res) => {
		// Check for validation errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				message: "Validation failed",
				errors: errors.array(),
			});
		}

		const { email, password } = req.body;

		// Find user by email (include password for comparison)
		const user = await User.findByEmail(email).select("+password");

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid email or password",
			});
		}

		// Check if user is active
		if (!user.isActive) {
			return res.status(401).json({
				success: false,
				message: "Account is deactivated",
			});
		}

		// Check password
		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: "Invalid email or password",
			});
		}

		// Generate token
		const token = generateToken(user._id);

		// Update last login
		user.lastLogin = new Date();
		await user.save();

		res.json({
			success: true,
			message: "Login successful",
			data: {
				user: user.getPublicProfile(),
				token,
			},
		});
	})
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post(
	"/forgot-password",
	[
		body("email")
			.isEmail()
			.normalizeEmail()
			.withMessage("Please provide a valid email"),
	],
	asyncHandler(async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				message: "Validation failed",
				errors: errors.array(),
			});
		}

		const { email } = req.body;

		const user = await User.findByEmail(email);
		if (!user) {
			// Don't reveal if user exists or not
			return res.json({
				success: true,
				message:
					"If an account with that email exists, a password reset link has been sent",
			});
		}

		// Generate reset token (in a real app, you'd send this via email)
		const resetToken = jwt.sign(
			{ userId: user._id, type: "password-reset" },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		// In a real application, you would:
		// 1. Save the reset token to the user document
		// 2. Send an email with the reset link
		// 3. Use a proper email service

		res.json({
			success: true,
			message: "Password reset link sent to your email",
			data: {
				resetToken, // In production, don't send this in response
			},
		});
	})
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
	"/reset-password",
	[
		body("token").notEmpty().withMessage("Reset token is required"),
		body("password")
			.isLength({ min: 6 })
			.withMessage("Password must be at least 6 characters long"),
	],
	asyncHandler(async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				message: "Validation failed",
				errors: errors.array(),
			});
		}

		const { token, password } = req.body;

		try {
			// Verify reset token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			if (decoded.type !== "password-reset") {
				return res.status(400).json({
					success: false,
					message: "Invalid reset token",
				});
			}

			// Find user
			const user = await User.findById(decoded.userId);
			if (!user) {
				return res.status(400).json({
					success: false,
					message: "Invalid reset token",
				});
			}

			// Update password
			user.password = password;
			await user.save();

			res.json({
				success: true,
				message: "Password reset successful",
			});
		} catch (error) {
			return res.status(400).json({
				success: false,
				message: "Invalid or expired reset token",
			});
		}
	})
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
	"/me",
	authenticateToken,
	asyncHandler(async (req, res) => {
		// This route requires authentication middleware
		// User will be available in req.user

		res.json({
			success: true,
			data: {
				user: req.user.getPublicProfile(),
			},
		});
	})
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post(
	"/logout",
	authenticateToken,
	asyncHandler(async (req, res) => {
		// In a real application, you might want to:
		// 1. Add the token to a blacklist
		// 2. Update user's last logout time

		res.json({
			success: true,
			message: "Logged out successfully",
		});
	})
);

module.exports = router;
