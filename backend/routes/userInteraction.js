const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/products-interaction', async (req, res) => {
    const { product_code, customerId } = req.query;

    // Validate input
    if (!product_code || !customerId) {
        return res.status(400).json({
            error: 'Product code and customer ID are required'
        });
    }
    const interaction_type = 'view'; // Define interaction type

    try {
        // Insert a new view interaction
        await db.query(`
            INSERT INTO user_product_interactions (customer_id, product_code, interaction_type, created_at, updated_at)
            VALUES (?, ?, ?, NOW(), NOW())
        `, [customerId, product_code, interaction_type]);

        // Send a success response
        return res.status(200).json({ message: 'Product interaction recorded successfully' });
    } catch (error) {
        console.error('Error updating product interaction:', error);
        return res.status(500).json({ error: 'Error updating product interaction' });
    }
});


module.exports = router;
