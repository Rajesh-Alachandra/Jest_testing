const Product = require('../models/Product');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all products with search, filter, sort, and pagination functionality
exports.getProducts = async (req, res) => {
    try {
        const { name, category, price, sortBy, sortOrder, page, limit } = req.query;

        let query = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' }; // case-insensitive search
        }

        if (category) {
            query.category = category;
        }

        if (price) {
            query.price = { $lte: price }; // products with price less than or equal to given price
        }

        let sortCriteria = {};
        if (sortBy && sortOrder) {
            sortCriteria[sortBy] = sortOrder === 'desc' ? -1 : 1;
        }

        // Pagination
        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;
        const skip = (pageNumber - 1) * pageSize;

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .sort(sortCriteria)
            .skip(skip)
            .limit(pageSize);

        res.json({
            products,
            pagination: {
                total,
                page: pageNumber,
                limit: pageSize,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
