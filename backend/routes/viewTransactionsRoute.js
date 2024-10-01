
const express = require('express');
const router = express.Router();
const db = require('../db');


// Middleware to verify token and extract user_id
async function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const [rows] = await db.query('SELECT user_id FROM tokens WHERE token = ? AND expires_at > NOW()', [token]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        req.user_id = rows[0].user_id;
        next();
    } catch (err) {
        console.error('Error during token validation:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

router.get('/cart-transactions', authenticateToken, async (req, res) => {
    const { user_id } = req;

    try {
        const [rows] = await db.query(`
            SELECT
                p.product_id,
                p.product_code,
                p.product_name,
                p.description,
     
                p.price,
                p.size,
                p.expiration_date,
                c.category_name,
                ci.quantity
            FROM
                cart_items AS ci
            JOIN
                product AS p ON ci.product_code = p.product_code
            JOIN
                category AS c ON p.category_id = c.category_id
            WHERE
                ci.customer_id = ? AND ci.status = 'Order In Process'
        `, [user_id]);

        if (!rows || rows.length === 0) {
            return res.status(200).json({ items: [], totalPrice: 0 });
        }

        const totalPrice = rows.reduce((total, item) => total + item.price * item.quantity, 0);

        res.status(200).json({
            items: rows.map(item => ({
                product_id: item.product_id,
                product_code: item.product_code,
                product_name: item.product_name, // Product name included
                description: item.description,
                brand: item.brand,
                category: item.category_name,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                expiration_date: item.expiration_date,
                sub_total: item.price * item.quantity
            })),
            totalPrice
        });
    } catch (err) {
        console.error('Error fetching cart items:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;
