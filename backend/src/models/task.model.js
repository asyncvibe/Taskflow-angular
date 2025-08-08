/**
 * TASK MODEL - MongoDB schema for task management
 *
 * Features:
 * - Task creation and assignment
 * - Priority and status tracking
 * - Due dates and time tracking
 * - User assignments and comments
 */

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Task title is required"],
			trim: true,
			maxlength: [200, "Task title cannot exceed 200 characters"],
		},
		description: {
			type: String,
			required: [true, "Task description is required"],
			trim: true,
			maxlength: [1000, "Task description cannot exceed 1000 characters"],
		},
		status: {
			type: String,
			enum: ["pending", "in-progress", "completed", "cancelled"],
			default: "pending",
		},
		priority: {
			type: String,
			enum: ["low", "medium", "high", "urgent"],
			default: "medium",
		},
		assignedTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Task must be assigned to a user"],
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Task creator is required"],
		},
		dueDate: {
			type: Date,
			required: [true, "Due date is required"],
		},
		completedAt: {
			type: Date,
			default: null,
		},
		estimatedHours: {
			type: Number,
			min: [0, "Estimated hours cannot be negative"],
			default: 0,
		},
		actualHours: {
			type: Number,
			min: [0, "Actual hours cannot be negative"],
			default: 0,
		},
		tags: [
			{
				type: String,
				trim: true,
				maxlength: [50, "Tag cannot exceed 50 characters"],
			},
		],
		attachments: [
			{
				filename: String,
				originalName: String,
				path: String,
				size: Number,
				uploadedAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		comments: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				content: {
					type: String,
					required: true,
					maxlength: [500, "Comment cannot exceed 500 characters"],
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		category: {
			type: String,
			enum: [
				"development",
				"design",
				"testing",
				"documentation",
				"meeting",
				"other",
			],
			default: "other",
		},
		isPublic: {
			type: Boolean,
			default: false,
		},
		progress: {
			type: Number,
			min: [0, "Progress cannot be negative"],
			max: [100, "Progress cannot exceed 100%"],
			default: 0,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Virtual for task status color
taskSchema.virtual("statusColor").get(function () {
	const statusColors = {
		pending: "#ffc107",
		"in-progress": "#17a2b8",
		completed: "#28a745",
		cancelled: "#dc3545",
	};
	return statusColors[this.status] || "#6c757d";
});

// Virtual for priority color
taskSchema.virtual("priorityColor").get(function () {
	const priorityColors = {
		low: "#28a745",
		medium: "#ffc107",
		high: "#fd7e14",
		urgent: "#dc3545",
	};
	return priorityColors[this.priority] || "#6c757d";
});

// Virtual for overdue status
taskSchema.virtual("isOverdue").get(function () {
	return this.dueDate < new Date() && this.status !== "completed";
});

// Virtual for days remaining
taskSchema.virtual("daysRemaining").get(function () {
	const now = new Date();
	const due = new Date(this.dueDate);
	const diffTime = due - now;
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
});

// Indexes for better query performance
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ tags: 1 });

// Pre-save middleware to update completedAt
taskSchema.pre("save", function (next) {
	if (this.status === "completed" && !this.completedAt) {
		this.completedAt = new Date();
	} else if (this.status !== "completed") {
		this.completedAt = null;
	}
	next();
});

// Static method to find tasks by user
taskSchema.statics.findByUser = function (userId) {
	return this.find({ assignedTo: userId }).populate(
		"assignedTo",
		"firstName lastName email"
	);
};

// Static method to find overdue tasks
taskSchema.statics.findOverdue = function () {
	return this.find({
		dueDate: { $lt: new Date() },
		status: { $ne: "completed" },
	}).populate("assignedTo", "firstName lastName email");
};

// Static method to find tasks by status
taskSchema.statics.findByStatus = function (status) {
	return this.find({ status }).populate(
		"assignedTo",
		"firstName lastName email"
	);
};

// Instance method to add comment
taskSchema.methods.addComment = function (userId, content) {
	this.comments.push({
		user: userId,
		content: content,
	});
	return this.save();
};

// Instance method to update progress
taskSchema.methods.updateProgress = function (progress) {
	this.progress = Math.max(0, Math.min(100, progress));
	if (this.progress === 100) {
		this.status = "completed";
	} else if (this.progress > 0) {
		this.status = "in-progress";
	}
	return this.save();
};

module.exports = mongoose.model("Task", taskSchema);
