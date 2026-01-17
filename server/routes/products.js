const router = require('express').Router();
const Product = require('../models/Product');

// GET /api/products
// Supports query: ?published=true|false
router.get('/', async (req, res) => {
    try {
        const { published } = req.query;
        let query = {};
        if (published === 'true') query.isPublished = true;
        if (published === 'false') query.isPublished = false;

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (err) {
        console.error("GET /api/products Error:", err);
        res.status(500).json({ message: err.message || "Internal Server Error" });
    }
});

// POST /api/products
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
        console.log("Product Created:", savedProduct.name);
    } catch (err) {
        if (err.name === 'ValidationError') {
            // Format Mongoose Validation Errors for frontend
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages[0], errors: messages });
        }
        console.error("POST /api/products Error:", err);
        res.status(500).json({ message: err.message || "Internal Server Error" });
    }
});

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        console.log(`Product Updated: ${updatedProduct.name} (ID: ${updatedProduct._id})`);
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (deletedProduct) {
            console.log(`Product Deleted: ${deletedProduct.name} (ID: ${req.params.id})`);
        } else {
            console.log(`Product Delete Failed (Not Found): ${req.params.id}`);
        }
        res.status(200).json({ message: 'Product has been deleted...' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// PATCH /api/products/:id/publish
router.patch('/:id/publish', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        product.isPublished = !product.isPublished;
        await product.save();

        console.log(`Product Publish Status Changed: ${product.name} -> ${product.isPublished ? 'Published' : 'Draft'}`);

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
