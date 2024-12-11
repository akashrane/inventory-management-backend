const express = require('express');
const router = express.Router();

// Route to fetch product quantities
router.get('/quantities', (req, res) => {
    const query = `
        SELECT COUNT(*) AS totalProducts, SUM(quantity) AS totalQuantity
        FROM products
    `;

    global.db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const { totalProducts, totalQuantity } = results[0];
        res.json({ totalProducts, totalQuantity });
    });
});

module.exports = router;
