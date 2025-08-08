const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

async function seedDemoUser() {
	const email = "demo@example.com";
	const existing = await User.findOne({ email });
	if (existing) {
		return { seeded: false, user: existing };
	}

	// Pass plain password; the pre('save') hook will hash it
	const user = await User.create({
		firstName: "Demo",
		lastName: "Admin",
		email,
		password: "password123",
		role: "admin",
		isActive: true,
	});

	return { seeded: true, user };
}

module.exports = { seedDemoUser };
