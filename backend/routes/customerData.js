const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/customer-insight', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                COUNT(*) AS user_count
            FROM 
                tokens
            WHERE 
                created_at >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) -- Start of the week
                AND created_at < DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 7 DAY) -- End of the week
        `);

        res.json({ insights: rows });
    } catch (error) {
        console.error('Error fetching customer insights:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/get-customer-details', async (req, res) => {
    const customerId = req.params.customer_id;

    try {
        const [rows] = await db.query('SELECT COUNT(*) AS itemCount FROM cart WHERE customer_id = ?', [customerId]);
        res.json({ itemCount: rows[0].itemCount });
    } catch (error) {
        console.error('Error fetching cart item count:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
