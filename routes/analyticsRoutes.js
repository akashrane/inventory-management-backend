const express = require('express');
const router = express.Router();


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


router.get('/test', (req, res) => {
    res.send('Analytics route is working');
});


router.get('/topselling', async (req, res) => {
       try {
      const query = `
      SELECT p.product_name, SUM(t.quantity) as sales_quantity
              FROM transactions t
              JOIN products p ON t.product_id = p.product_id
              WHERE t.change_type = 'remove'
              GROUP BY p.product_id
              ORDER BY sales_quantity DESC
              LIMIT 10;
          `;
          const [results] = await global.db.promise().query(query);
          res.json(results);
      } catch (error) {
          res.status(500).json({ error: 'Failed to fetch top-selling products' });
      }
  });


router.get('/lowstock', (req, res) => {
    const threshold = 10; // Set the stock threshold
    const query = `
        SELECT product_name, quantity, location 
        FROM products 
        WHERE quantity < ?
    `;
    global.db.query(query, [threshold], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


router.get('/stockdistribution', async (req, res) => {
    try {
        const query = `
            SELECT 
                location, 
                SUM(quantity) AS total_quantity
            FROM products
            GROUP BY location
            ORDER BY location
        `;
        const [results] = await global.db.promise().query(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stock distribution data' });
    }
});



router.get('/dailysales', (req, res) => {
    const query = `
        SELECT 
            DATE(timestamp) AS date, 
            SUM(CASE WHEN change_type = 'add' THEN quantity ELSE -quantity END) AS sales_quantity
        FROM transactions
        WHERE timestamp >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(timestamp)
        ORDER BY date ASC
    `;
    global.db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});



router.get('/transactionbreakdown', (req, res) => {
    const query = `
        SELECT 
            change_type, 
            COUNT(*) AS transaction_count
        FROM transactions
        GROUP BY change_type
    `;
    global.db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching transaction breakdown:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});



module.exports = router;
