// const express = require('express');
// const router = express.Router();

// // Fetch all transactions
// router.get('/', (req, res) => {
//     const query = 'SELECT * FROM transactions';
//     global.db.query(query, (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(results);
//     });
// });

// // Get a specific transaction by ID
// router.get('/:id', (req, res) => {
//     const query = 'SELECT * FROM transactions WHERE transaction_id = ?';
//     global.db.query(query, [req.params.id], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         if (results.length === 0) return res.status(404).json({ error: 'Transaction not found' });
//         res.json(results[0]);
//     });
// });

// // Add a new transaction
// router.post('/', (req, res) => {
//     const { product_id, user_id, change_type, quantity, notes } = req.body;
//     const query = 'INSERT INTO transactions (product_id, user_id, change_type, quantity, notes) VALUES (?, ?, ?, ?, ?)';
//     global.db.query(query, [product_id, user_id, change_type, quantity, notes], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.status(201).json({ message: 'Transaction recorded successfully' });
//     });
// });

// // Add a new transaction and update product quantity
// router.post('/', (req, res) => {
//     const { product_id, user_id, change_type, quantity, notes } = req.body;

//     // Start a transaction to ensure consistency
//     global.db.beginTransaction((err) => {
//         if (err) return res.status(500).json({ error: err.message });

//         // Insert the new transaction
//         const transactionQuery = 'INSERT INTO transactions (product_id, user_id, change_type, quantity, notes) VALUES (?, ?, ?, ?, ?)';
//         global.db.query(transactionQuery, [product_id, user_id, change_type, quantity, notes], (err, results) => {
//             if (err) {
//                 return global.db.rollback(() => {
//                     res.status(500).json({ error: err.message });
//                 });
//             }

//             // Update the product quantity
//             const updateQuery = `
//                 UPDATE products 
//                 SET quantity = quantity ${change_type === 'add' ? '+' : '-'} ? 
//                 WHERE product_id = ?
//             `;
//             global.db.query(updateQuery, [quantity, product_id], (err, results) => {
//                 if (err) {
//                     return global.db.rollback(() => {
//                         res.status(500).json({ error: err.message });
//                     });
//                 }

//                 // Commit the transaction
//                 global.db.commit((err) => {
//                     if (err) {
//                         return global.db.rollback(() => {
//                             res.status(500).json({ error: err.message });
//                         });
//                     }
//                     res.status(201).json({ message: 'Transaction recorded and product quantity updated successfully' });
//                 });
//             });
//         });
//     });
// });


// // Delete a transaction
// router.delete('/:id', (req, res) => {
//     const query = 'DELETE FROM transactions WHERE transaction_id = ?';
//     global.db.query(query, [req.params.id], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json({ message: 'Transaction deleted successfully' });
//     });
// });

// module.exports = router;


const express = require('express');
const router = express.Router();

// Fetch all transactions
router.get('/', (req, res) => {
    const query = 'SELECT * FROM transactions';
    global.db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get a specific transaction by ID
router.get('/:id', (req, res) => {
    const query = 'SELECT * FROM transactions WHERE transaction_id = ?';
    global.db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Transaction not found' });
        res.json(results[0]);
    });
});

// Add a new transaction and update product quantity
router.post('/', (req, res) => {
    const { product_id, user_id, change_type, quantity, notes } = req.body;

    // Start a database transaction to ensure consistency
    global.db.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: err.message });

        // Insert the transaction into the transactions table
        const transactionQuery = 'INSERT INTO transactions (product_id, user_id, change_type, quantity, notes) VALUES (?, ?, ?, ?, ?)';
        global.db.query(transactionQuery, [product_id, user_id, change_type, quantity, notes], (err, results) => {
            if (err) {
                return global.db.rollback(() => {
                    res.status(500).json({ error: err.message });
                });
            }

            // Update the product quantity in the products table
            const updateQuery = `
                UPDATE products 
                SET quantity = quantity ${change_type === 'add' ? '+' : '-'} ?
                WHERE product_id = ?
            `;
            global.db.query(updateQuery, [quantity, product_id], (err, results) => {
                if (err) {
                    return global.db.rollback(() => {
                        res.status(500).json({ error: err.message });
                    });
                }

                // Commit the transaction
                global.db.commit((err) => {
                    if (err) {
                        return global.db.rollback(() => {
                            res.status(500).json({ error: err.message });
                        });
                    }
                    res.status(201).json({ message: 'Transaction recorded and product quantity updated successfully' });
                });
            });
        });
    });
});

// Delete a transaction
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM transactions WHERE transaction_id = ?';
    global.db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Transaction deleted successfully' });
    });
});

module.exports = router;
