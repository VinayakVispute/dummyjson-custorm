const express = require("express");
const fs = require("fs");
const cors = require("cors")
const app = express();
const PORT = 3000;

// Load products from JSON file
const rawData = fs.readFileSync("products.json");
const products = JSON.parse(rawData).products;
app.use(cors({
    origin: "https://ecommerce-infotechtion-qkeb.vercel.app"
}))


app.get("/products", (req, res) => {
    let { category, minPrice, maxPrice, limit, skip, sortBy, order, select } = req.query;

    // Convert query parameters to appropriate types
    minPrice = minPrice ? parseFloat(minPrice) : 0;
    maxPrice = maxPrice ? parseFloat(maxPrice) : Infinity;
    limit = limit ? parseInt(limit) : products.length; // Default to all products
    skip = skip ? parseInt(skip) : 0;
    order = order && order.toLowerCase() === "desc" ? "desc" : "asc";

    if (isNaN(minPrice) || isNaN(maxPrice) || isNaN(limit) || isNaN(skip)) {
        return res.status(400).json({ error: "Invalid query parameters" });
    }

    // Filter products by price range and category (if specified)
    let filteredProducts = products.filter(product =>
        product.price >= minPrice &&
        product.price <= maxPrice &&
        (!category || product.category.toLowerCase() === category.toLowerCase())
    );
    // Get min and max price from filtered results
    const prices = filteredProducts.map(p => p.price);
    const maxProductPrice = prices.length ? Math.max(...prices) : null;
    const minProductPrice = prices.length ? Math.min(...prices) : null;

    // Sorting
    if (sortBy && filteredProducts.length && filteredProducts[0][sortBy] !== undefined) {
        filteredProducts.sort((a, b) =>
            order === "asc" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
        );
    }

    // Get total count before pagination
    const total = filteredProducts.length;

    // Apply pagination (limit & skip)
    if (limit !== 0) {
        filteredProducts = filteredProducts.slice(skip, skip + limit);
    }

    // Select specific fields
    if (select) {
        const selectedFields = select.split(",");
        filteredProducts = filteredProducts.map(product => {
            let selectedProduct = {};
            selectedFields.forEach(field => {
                if (product[field] !== undefined) {
                    selectedProduct[field] = product[field];
                }
            });
            return selectedProduct;
        });
    }

    res.json({
        total, limit, skip, minPrice: minProductPrice,
        maxPrice: maxProductPrice,
        products: filteredProducts
    });
});

// Route to get all categories (slug & name only)
app.get("/categories", (req, res) => {
    // Extract unique categories from products
    const categories = Array.from(new Set(products.map(p => p.category))).map(category => ({
        slug: category.toLowerCase().replace(/\s+/g, "-"),
        name: category
    }));

    res.json(categories);
});


// Search products by keyword in title or description
app.get("/products/search", (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ error: "Search query is required" });
    }

    const query = q.toLowerCase();
    const matchedProducts = products.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );

    res.json({ total: matchedProducts.length, products: matchedProducts, skip: null, limit: null });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
