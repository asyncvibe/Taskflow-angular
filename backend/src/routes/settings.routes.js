const express = require("express");
const User = require("../models/user.model");
const { asyncHandler } = require("../middleware/error.middleware");

const router = express.Router();

// Get user settings
router.get(
	"/",
	asyncHandler(async (req, res) => {
		const user = await User.findById(req.user._id).select("preferences");

		res.json({
			success: true,
			data: user.preferences,
		});
	})
);

// Update user settings
router.put(
	"/",
	asyncHandler(async (req, res) => {
		const user = await User.findByIdAndUpdate(
			req.user._id,
			{ preferences: req.body },
			{ new: true, runValidators: true }
		).select("preferences");

		res.json({
			success: true,
			data: user.preferences,
		});
	})
);

// Update profile
router.put(
	"/profile",
	asyncHandler(async (req, res) => {
		const { firstName, lastName, phone, avatar } = req.body;

		const user = await User.findByIdAndUpdate(
			req.user._id,
			{ firstName, lastName, phone, avatar },
			{ new: true, runValidators: true }
		).select("-password");

		res.json({
			success: true,
			data: user,
		});
	})
);

// Change password
router.put(
	"/password",
	asyncHandler(async (req, res) => {
		const { currentPassword, newPassword } = req.body;

		const user = await User.findById(req.user._id).select("+password");

		// Verify current password
		const isPasswordValid = await user.comparePassword(currentPassword);
		if (!isPasswordValid) {
			return res.status(400).json({
				success: false,
				message: "Current password is incorrect",
			});
		}

		// Update password
		user.password = newPassword;
		await user.save();

		res.json({
			success: true,
			message: "Password updated successfully",
		});
	})
);

module.exports = router;
