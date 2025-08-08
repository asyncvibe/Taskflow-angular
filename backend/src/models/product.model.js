/**
 * PRODUCT MODEL - MongoDB schema for e-commerce product management
 *
 * Features:
 * - Product catalog management
 * - Inventory tracking
 * - Pricing and discounts
 * - Categories and tags
 * - Image management
 */

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Product name is required"],
			trim: true,
			maxlength: [200, "Product name cannot exceed 200 characters"],
		},
		description: {
			type: String,
			required: [true, "Product description is required"],
			trim: true,
			maxlength: [2000, "Product description cannot exceed 2000 characters"],
		},
		shortDescription: {
			type: String,
			trim: true,
			maxlength: [500, "Short description cannot exceed 500 characters"],
		},
		sku: {
			type: String,
			required: [true, "SKU is required"],
			unique: true,
			trim: true,
			uppercase: true,
		},
		price: {
			type: Number,
			required: [true, "Product price is required"],
			min: [0, "Price cannot be negative"],
		},
		comparePrice: {
			type: Number,
			min: [0, "Compare price cannot be negative"],
			default: null,
		},
		costPrice: {
			type: Number,
			min: [0, "Cost price cannot be negative"],
			default: 0,
		},
		stock: {
			type: Number,
			required: [true, "Stock quantity is required"],
			min: [0, "Stock cannot be negative"],
			default: 0,
		},
		lowStockThreshold: {
			type: Number,
			min: [0, "Low stock threshold cannot be negative"],
			default: 5,
		},
		category: {
			type: String,
			required: [true, "Product category is required"],
			trim: true,
		},
		subcategory: {
			type: String,
			trim: true,
		},
		tags: [
			{
				type: String,
				trim: true,
				maxlength: [50, "Tag cannot exceed 50 characters"],
			},
		],
		images: [
			{
				url: {
					type: String,
					required: true,
				},
				alt: String,
				isPrimary: {
					type: Boolean,
					default: false,
				},
				order: {
					type: Number,
					default: 0,
				},
			},
		],
		specifications: [
			{
				name: {
					type: String,
					required: true,
					trim: true,
				},
				value: {
					type: String,
					required: true,
					trim: true,
				},
			},
		],
		dimensions: {
			length: { type: Number, min: 0 },
			width: { type: Number, min: 0 },
			height: { type: Number, min: 0 },
			weight: { type: Number, min: 0 },
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
		isDigital: {
			type: Boolean,
			default: false,
		},
		digitalFile: {
			type: String,
			default: null,
		},
		vendor: {
			type: String,
			trim: true,
		},
		brand: {
			type: String,
			trim: true,
		},
		warranty: {
			type: String,
			trim: true,
		},
		shippingInfo: {
			weight: { type: Number, min: 0 },
			dimensions: {
				length: { type: Number, min: 0 },
				width: { type: Number, min: 0 },
				height: { type: Number, min: 0 },
			},
			freeShipping: { type: Boolean, default: false },
			shippingClass: { type: String, default: "standard" },
		},
		seo: {
			metaTitle: {
				type: String,
				maxlength: [60, "Meta title cannot exceed 60 characters"],
			},
			metaDescription: {
				type: String,
				maxlength: [160, "Meta description cannot exceed 160 characters"],
			},
			keywords: [String],
		},
		ratings: {
			average: {
				type: Number,
				min: [0, "Average rating cannot be negative"],
				max: [5, "Average rating cannot exceed 5"],
				default: 0,
			},
			count: {
				type: Number,
				min: [0, "Rating count cannot be negative"],
				default: 0,
			},
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Virtual for discount percentage
productSchema.virtual("discountPercentage").get(function () {
	if (this.comparePrice && this.comparePrice > this.price) {
		return Math.round(
			((this.comparePrice - this.price) / this.comparePrice) * 100
		);
	}
	return 0;
});

// Virtual for profit margin
productSchema.virtual("profitMargin").get(function () {
	if (this.costPrice > 0) {
		return Math.round(((this.price - this.costPrice) / this.costPrice) * 100);
	}
	return 0;
});

// Virtual for stock status
productSchema.virtual("stockStatus").get(function () {
	if (this.stock === 0) return "out-of-stock";
	if (this.stock <= this.lowStockThreshold) return "low-stock";
	return "in-stock";
});

// Virtual for primary image
productSchema.virtual("primaryImage").get(function () {
	const primary = this.images.find((img) => img.isPrimary);
	return primary ? primary.url : this.images[0] ? this.images[0].url : null;
});

// Indexes for better query performance
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ "ratings.average": -1 });
productSchema.index({ createdAt: -1 });

// Pre-save middleware to ensure only one primary image
productSchema.pre("save", function (next) {
	if (this.images && this.images.length > 0) {
		const primaryImages = this.images.filter((img) => img.isPrimary);
		if (primaryImages.length > 1) {
			// Set only the first one as primary
			this.images.forEach((img, index) => {
				img.isPrimary = index === 0;
			});
		}
	}
	next();
});

// Static method to find active products
productSchema.statics.findActive = function () {
	return this.find({ isActive: true });
};

// Static method to find featured products
productSchema.statics.findFeatured = function () {
	return this.find({ isActive: true, isFeatured: true });
};

// Static method to find products by category
productSchema.statics.findByCategory = function (category) {
	return this.find({ category, isActive: true });
};

// Static method to find low stock products
productSchema.statics.findLowStock = function () {
	return this.find({
		stock: { $lte: "$lowStockThreshold" },
		isActive: true,
	});
};

// Static method to search products
productSchema.statics.search = function (query) {
	return this.find({
		$text: { $search: query },
		isActive: true,
	}).sort({ score: { $meta: "textScore" } });
};

// Instance method to update stock
productSchema.methods.updateStock = function (quantity) {
	this.stock = Math.max(0, this.stock + quantity);
	return this.save();
};

// Instance method to add image
productSchema.methods.addImage = function (imageData) {
	if (imageData.isPrimary) {
		// Remove primary from other images
		this.images.forEach((img) => (img.isPrimary = false));
	}
	this.images.push(imageData);
	return this.save();
};

// Instance method to remove image
productSchema.methods.removeImage = function (imageId) {
	this.images = this.images.filter((img) => img._id.toString() !== imageId);
	return this.save();
};

module.exports = mongoose.model("Product", productSchema);
