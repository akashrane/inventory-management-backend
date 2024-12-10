const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require("../middleware/roleMiddleware");


// Fetch all products
router.get('/', verifyToken, (req, res) => {
    const query = 'SELECT * FROM suppliers';
    global.db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get a specific product by ID
router.get('/:id', (req, res) => {
    const query = 'SELECT * FROM suppliers WHERE supplier_id = ?';
    global.db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Supplier not found' });
        res.json(results[0]);
    });
});


// Update a product
router.put('/:id', (req, res) => {
    const { supplier_name, contact_info, address} = req.body;
    const query = 'UPDATE suppliers SET supplier_name = ?, contact_info = ?, address = ? WHERE supplier_id = ?';
    global.db.query(query, [supplier_name, contact_info, address, req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Supplier updated successfully' });
    });
});


// Example route: Only 'manager' can add products
router.post("/", verifyToken, verifyRole(["manager"]), (req, res) => {
    const { supplier_name, contact_info, address} = req.body;

    if (!supplier_name || !contact_info || !address) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const query = `
        INSERT INTO suppliers (supplier_name, contact_info, address)
        VALUES (?, ?, ?)
    `;
    global.db.query(query, [supplier_name, contact_info, address], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Failed to add supplier" });
        }
        res.status(201).json({ message: "Supplier added successfully" });
    });
});

// Example route: Only 'manager' can delete products
router.delete("/:id", verifyToken, verifyRole(["manager"]), (req, res) => {
    const supplierId = req.params.id;

    const query = "DELETE FROM suppliers WHERE supplier_id = ?";
    global.db.query(query, [supplierId], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Failed to delete supplier" });
        }
        res.status(200).json({ message: "supplier deleted successfully" });
    });
});

module.exports = router;
