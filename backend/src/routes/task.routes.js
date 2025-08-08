const express = require("express");
const Task = require("../models/task.model");
const { asyncHandler } = require("../middleware/error.middleware");

const router = express.Router();

// Get all tasks
router.get(
	"/",
	asyncHandler(async (req, res) => {
		const tasks = await Task.find()
			.populate("assignedTo", "firstName lastName email")
			.populate("createdBy", "firstName lastName email");

		res.json({
			success: true,
			data: tasks,
		});
	})
);

// Get task by ID
router.get(
	"/:id",
	asyncHandler(async (req, res) => {
		const task = await Task.findById(req.params.id)
			.populate("assignedTo", "firstName lastName email")
			.populate("createdBy", "firstName lastName email");

		if (!task) {
			return res.status(404).json({
				success: false,
				message: "Task not found",
			});
		}

		res.json({
			success: true,
			data: task,
		});
	})
);

// Create new task
router.post(
	"/",
	asyncHandler(async (req, res) => {
		const task = new Task({
			...req.body,
			createdBy: req.user._id,
		});

		await task.save();

		const populatedTask = await Task.findById(task._id)
			.populate("assignedTo", "firstName lastName email")
			.populate("createdBy", "firstName lastName email");

		res.status(201).json({
			success: true,
			data: populatedTask,
		});
	})
);

// Update task
router.put(
	"/:id",
	asyncHandler(async (req, res) => {
		const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		})
			.populate("assignedTo", "firstName lastName email")
			.populate("createdBy", "firstName lastName email");

		if (!task) {
			return res.status(404).json({
				success: false,
				message: "Task not found",
			});
		}

		res.json({
			success: true,
			data: task,
		});
	})
);

// Delete task
router.delete(
	"/:id",
	asyncHandler(async (req, res) => {
		const task = await Task.findByIdAndDelete(req.params.id);

		if (!task) {
			return res.status(404).json({
				success: false,
				message: "Task not found",
			});
		}

		res.json({
			success: true,
			message: "Task deleted successfully",
		});
	})
);

module.exports = router;
