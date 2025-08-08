/**
 * AUTHENTICATION MIDDLEWARE - JWT token verification
 *
 * Features:
 * - JWT token verification
 * - Role-based access control
 * - User context injection
 */

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

/**
 * Verify JWT token and attach user to request
 */
const authenticateToken = async (req, res, next) => {
	try {
		const authHeader = req.headers["authorization"];
		const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Access token is required",
			});
		}

		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Get user from database
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "User not found",
			});
		}

		if (!user.isActive) {
			return res.status(401).json({
				success: false,
				message: "User account is deactivated",
			});
		}

		// Attach user to request
		req.user = user;
		next();
	} catch (error) {
		if (error.name === "JsonWebTokenError") {
			return res.status(401).json({
				success: false,
				message: "Invalid token",
			});
		}

		if (error.name === "TokenExpiredError") {
			return res.status(401).json({
				success: false,
				message: "Token has expired",
			});
		}

		console.error("Auth middleware error:", error);
		return res.status(500).json({
			success: false,
			message: "Authentication error",
		});
	}
};

/**
 * Check if user has required role
 */
const requireRole = (roles) => {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: "Authentication required",
			});
		}

		if (!roles.includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: "Insufficient permissions",
			});
		}

		next();
	};
};

/**
 * Check if user is admin
 */
const requireAdmin = requireRole(["admin"]);

/**
 * Check if user is admin or manager
 */
const requireAdminOrManager = requireRole(["admin", "manager"]);

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
	try {
		const authHeader = req.headers["authorization"];
		const token = authHeader && authHeader.split(" ")[1];

		if (token) {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const user = await User.findById(decoded.userId).select("-password");

			if (user && user.isActive) {
				req.user = user;
			}
		}

		next();
	} catch (error) {
		// Continue without authentication
		next();
	}
};

module.exports = {
	authenticateToken,
	requireRole,
	requireAdmin,
	requireAdminOrManager,
	optionalAuth,
};
