import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const products = await Product.find({ ...keyword }).populate('category', 'name');
    res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category', 'name');

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        images: ['/images/sample.jpg'],
        category: '675400000000000000000000', // Valid ObjectID placeholder, will need real one or logic to pick one
        // Better logic: find first category and use it
        stock: 0,
        numReviews: 0,
        description: 'Sample description',
    });

    // Temp fix for category:
    // Ideally we pass category in body, but if this is just "Create Empty Product" for UI to fill, 
    // we need a valid category ID or make it optional in schema (it is required).
    // Let's rely on the user to send data or update the create logic to accept body.
    // For now, I will create with a dummy logic or make it accept data from req.body if provided.

    // Changing approach: standard "Create" usually creates a placeholder. 
    // I'll fetch the first category available.
    // However, I can't import Category here easily without overhead. 
    // I will change this to accept data from body OR create sample.
    // Let's stick to Amazon style: Admin clicks "Create", gets a blank form? 
    // Or "Create Sample"? usually "Create Sample". 
    // I'll leave the Category ID issue for when we actually run it or improve it now.

    // Let's make it robust:
    // logic: if req.body has info use it, else sample.

    const createdProduct = await product.save(); // This might fail due to category validation if ID is invalid.
    res.status(201).json(createdProduct);
});

// Let's actually implementation properly:
const createProductReal = asyncHandler(async (req, res) => {
    // We'll rely on frontend sending data or just bypassing validation for now? No, Schema enforces it.
    // I'll update it to just create a product with data from Body for simplicity in this MVP.
    const { name, price, description, images, category, stock } = req.body;

    const product = new Product({
        name,
        price,
        user: req.user._id,
        images,
        category,
        stock,
        numReviews: 0,
        description,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});


// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, images, category, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.images = images;
        product.category = category;
        product.stock = stock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

export {
    getProducts,
    getProductById,
    deleteProduct,
    createProductReal as createProduct, // exporting the real one
    updateProduct,
    createProductReview,
};
