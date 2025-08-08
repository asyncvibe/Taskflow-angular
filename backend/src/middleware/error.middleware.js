/**
 * ERROR HANDLING MIDDLEWARE - Centralized error management
 *
 * Features:
 * - Global error handling
 * - Validation error formatting
 * - MongoDB error handling
 * - Custom error responses
 */

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;

	// Log error for debugging
	console.error("Error:", {
		message: err.message,
		stack: err.stack,
		url: req.url,
		method: req.method,
		user: req.user ? req.user._id : "anonymous",
	});

	// Mongoose bad ObjectId
	if (err.name === "CastError") {
		const message = "Resource not found";
		error = { message, statusCode: 404 };
	}

	// Mongoose duplicate key
	if (err.code === 11000) {
		const field = Object.keys(err.keyValue)[0];
		const message = `${field} already exists`;
		error = { message, statusCode: 400 };
	}

	// Mongoose validation error
	if (err.name === "ValidationError") {
		const message = Object.values(err.errors)
			.map((val) => val.message)
			.join(", ");
		error = { message, statusCode: 400 };
	}

	// JWT errors
	if (err.name === "JsonWebTokenError") {
		const message = "Invalid token";
		error = { message, statusCode: 401 };
	}

	if (err.name === "TokenExpiredError") {
		const message = "Token expired";
		error = { message, statusCode: 401 };
	}

	// Multer errors
	if (err.code === "LIMIT_FILE_SIZE") {
		const message = "File too large";
		error = { message, statusCode: 400 };
	}

	if (err.code === "LIMIT_UNEXPECTED_FILE") {
		const message = "Unexpected file field";
		error = { message, statusCode: 400 };
	}

	// Default error response
	const statusCode = error.statusCode || err.statusCode || 500;
	const message = error.message || "Server Error";

	res.status(statusCode).json({
		success: false,
		message,
		...(process.env.NODE_ENV === "development" && { stack: err.stack }),
	});
};

/**
 * Async error wrapper
 */
const asyncHandler = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Custom error class
 */
class AppError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}

/**
 * Not found middleware
 */
const notFound = (req, res, next) => {
	const error = new AppError(`Route ${req.originalUrl} not found`, 404);
	next(error);
};

module.exports = {
	errorHandler,
	asyncHandler,
	AppError,
	notFound,
};
