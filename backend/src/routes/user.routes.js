const express = require("express");
const User = require("../models/user.model");
const { asyncHandler } = require("../middleware/error.middleware");
const { requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

// Get all users (admin only)
router.get(
	"/",
	requireAdmin,
	asyncHandler(async (req, res) => {
		const users = await User.find().select("-password");
		res.json({
			success: true,
			data: users,
		});
	})
);

// Get user by ID
router.get(
	"/:id",
	asyncHandler(async (req, res) => {
		const user = await User.findById(req.params.id).select("-password");
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}
		res.json({
			success: true,
			data: user,
		});
	})
);

// Update user
router.put(
	"/:id",
	asyncHandler(async (req, res) => {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		}).select("-password");

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		res.json({
			success: true,
			data: user,
		});
	})
);

// Delete user (admin only)
router.delete(
	"/:id",
	requireAdmin,
	asyncHandler(async (req, res) => {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		res.json({
			success: true,
			message: "User deleted successfully",
		});
	})
);

module.exports = router;
