const express = require("express");
const Product = require("../models/product.model");
const { asyncHandler } = require("../middleware/error.middleware");

const router = express.Router();

// Get all products
router.get(
	"/",
	asyncHandler(async (req, res) => {
		const products = await Product.find({ isActive: true }).populate(
			"createdBy",
			"firstName lastName"
		);

		res.json({
			success: true,
			data: products,
		});
	})
);

// Get product by ID
router.get(
	"/:id",
	asyncHandler(async (req, res) => {
		const product = await Product.findById(req.params.id).populate(
			"createdBy",
			"firstName lastName"
		);

		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product not found",
			});
		}

		res.json({
			success: true,
			data: product,
		});
	})
);

// Create new product
router.post(
	"/",
	asyncHandler(async (req, res) => {
		const product = new Product({
			...req.body,
			createdBy: req.user._id,
		});

		await product.save();

		const populatedProduct = await Product.findById(product._id).populate(
			"createdBy",
			"firstName lastName"
		);

		res.status(201).json({
			success: true,
			data: populatedProduct,
		});
	})
);

// Update product
router.put(
	"/:id",
	asyncHandler(async (req, res) => {
		const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		}).populate("createdBy", "firstName lastName");

		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product not found",
			});
		}

		res.json({
			success: true,
			data: product,
		});
	})
);

// Delete product
router.delete(
	"/:id",
	asyncHandler(async (req, res) => {
		const product = await Product.findByIdAndDelete(req.params.id);

		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product not found",
			});
		}

		res.json({
			success: true,
			message: "Product deleted successfully",
		});
	})
);

module.exports = router;
