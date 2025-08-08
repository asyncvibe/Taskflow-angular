/**
 * USER MODEL - MongoDB schema for user management
 *
 * Features:
 * - User authentication fields
 * - Role-based access control
 * - Profile information
 * - Timestamps and validation
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, "First name is required"],
			trim: true,
			maxlength: [50, "First name cannot exceed 50 characters"],
		},
		lastName: {
			type: String,
			required: [true, "Last name is required"],
			trim: true,
			maxlength: [50, "Last name cannot exceed 50 characters"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
			match: [
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				"Please enter a valid email",
			],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters long"],
			select: false, // Don't include password in queries by default
		},
		role: {
			type: String,
			enum: ["user", "admin", "manager"],
			default: "user",
		},
		avatar: {
			type: String,
			default: null,
		},
		phone: {
			type: String,
			trim: true,
			match: [/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		lastLogin: {
			type: Date,
			default: null,
		},
		preferences: {
			theme: {
				type: String,
				enum: ["light", "dark"],
				default: "light",
			},
			notifications: {
				email: { type: Boolean, default: true },
				push: { type: Boolean, default: true },
				sms: { type: Boolean, default: false },
			},
			language: {
				type: String,
				default: "en",
			},
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Virtual for full name
userSchema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

// Virtual for user ID
userSchema.virtual("userId").get(function () {
	return this._id;
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
	// Only hash the password if it has been modified (or is new)
	if (!this.isModified("password")) return next();

	try {
		// Hash password with cost of 12
		const hashedPassword = await bcrypt.hash(this.password, 12);
		this.password = hashedPassword;
		next();
	} catch (error) {
		next(error);
	}
});

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get public profile
userSchema.methods.getPublicProfile = function () {
	const userObject = this.toObject();
	delete userObject.password;
	return userObject;
};

// Static method to find by email
userSchema.statics.findByEmail = function (email) {
	return this.findOne({ email: email.toLowerCase() });
};

// Static method to find active users
userSchema.statics.findActiveUsers = function () {
	return this.find({ isActive: true });
};

module.exports = mongoose.model("User", userSchema);
