/**
 * EXPRESS SERVER - Main backend application
 *
 * Key Features:
 * - Express server setup with middleware
 * - MongoDB connection
 * - CORS configuration for frontend
 * - Authentication middleware
 * - API routes for all features
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/task.routes");
const productRoutes = require("./routes/product.routes");
const settingsRoutes = require("./routes/settings.routes");

const { authenticateToken } = require("./middleware/auth.middleware");
const { errorHandler } = require("./middleware/error.middleware");
const { seedDemoUser } = require("./config/seed");

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Logging middleware
app.use(morgan("combined"));

// CORS configuration for frontend
const corsOptions = {
	origin: process.env.FRONTEND_URL || "http://localhost:4200",
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
	allowedHeaders: [
		"Content-Type",
		"Authorization",
		"X-Requested-With",
		"Accept",
	],
	optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files
app.use("/uploads", express.static("uploads"));

// Health check endpoint
app.get("/health", (req, res) => {
	res.status(200).json({
		status: "OK",
		message: "Server is running",
		timestamp: new Date().toISOString(),
	});
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authenticateToken, userRoutes);
app.use("/api/tasks", authenticateToken, taskRoutes);
app.use("/api/products", authenticateToken, productRoutes);
app.use("/api/settings", authenticateToken, settingsRoutes);

// 404 handler
app.use((req, res) => {
	res.status(404).json({
		success: false,
		message: "Route not found",
	});
});

// Error handling middleware
app.use(errorHandler);

// MongoDB connection
mongoose
	.connect(
		process.env.MONGODB_URI || "mongodb://localhost:27017/amisha_joshi_db",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(async () => {
		console.log("✅ Connected to MongoDB");
		console.log("📊 Database: amisha_joshi_db");
		// Seed demo admin user
		const result = await seedDemoUser();
		if (result.seeded) {
			console.log("🌱 Seeded demo user: demo@example.com / password123");
		}
	})
	.catch((error) => {
		console.error("❌ MongoDB connection error:", error);
		process.exit(1);
	});

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
	console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
	console.log(`🔗 Frontend URL: http://localhost:4200`);
	console.log(`📈 Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;
