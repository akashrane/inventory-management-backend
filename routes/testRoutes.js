const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
    res.send('Analytics route is working');
});



router.get('/analytics/topselling', async (req, res) => {
    console.log('Top-selling products route hit');
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
          res.json('akash');
      } catch (error) {
          res.status(500).json({ error: 'Failed to fetch top-selling products' });
      }
  });
  
  

  
module.exports = router;

  