const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password, email, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)';
        global.db.query(query, [username, hashedPassword, email, role], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login a user
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';

    global.db.query(query, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { username: user.username, role: user.role } });
    });
});

module.exports = router;



router.get('/counts', (req, res) => {
    const queries = [
        'SELECT count(*) AS total_products FROM Products',
        'SELECT SUM(quantity) AS total_quantity FROM Products',
        'SELECT count(*) AS total_suppliers FROM Suppliers'
    ];

    const results = {};

    let completedQueries = 0;

    queries.forEach((query, index) => {
        global.db.query(query, (err, queryResults) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Add the result of the query to the results object
            if (index === 0) results.total_products = queryResults[0].total_products;
            if (index === 1) results.total_quantity = queryResults[0].total_quantity;
            if (index === 2) results.total_suppliers = queryResults[0].total_suppliers;

            completedQueries++;

            // Send the response when all queries are completed
            if (completedQueries === queries.length) {
                res.json(results);
            }
        });
    });
});

module.exports = router;