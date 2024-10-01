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

// Function to generate a unique code for cart_items_id
function generateCartItemId() {
    return 'CART-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

// Route to add product to cart
router.post('/add-to-cart', authenticateToken, async (req, res) => {
    const { product_code, quantity } = req.body;
    const { user_id } = req;

    console.log('--- New request to add product to cart ---');
    console.log(`User ID: ${user_id}`);
    console.log(`Product Code: ${product_code}`);
    console.log(`Quantity: ${quantity}`);

    // Validate inputs
    if (!user_id) return res.status(400).json({ error: 'User ID is required' });
    if (!product_code) return res.status(400).json({ error: 'Product Code is required' });
    if (!quantity || quantity <= 0) return res.status(400).json({ error: 'A valid quantity greater than 0 is required' });

    try {
        // Check if the product exists in the system
        const [[product]] = await db.query('SELECT product_id FROM product WHERE product_code = ?', [product_code]);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        // Ensure the cart exists for the user
        const [[existingCart]] = await db.query('SELECT cart_id FROM cart WHERE customer_id = ?', [user_id]);
        let cart_id;

        if (!existingCart) {
            // Create a new cart for the user if it doesn't exist
            const [result] = await db.query('INSERT INTO cart (customer_id) VALUES (?)', [user_id]);
            cart_id = result.insertId;
        } else {
            cart_id = existingCart.cart_id;
        }

        // Check if the product already exists in the cart
        const [[existingCartItem]] = await db.query(
            'SELECT cart_id, status, quantity FROM cart_items WHERE cart_id = ? AND customer_id = ? AND product_code = ? AND status = "Order Pending"',
            [cart_id, user_id, product_code]
        );

        if (existingCartItem) {
            console.log(`Product ${product_code} is already in the cart with status "Order In Progress". Updating quantity.`);

            // Update the existing cart item quantity
            const [updateResult] = await db.query(
                'UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_code = ? AND status = "Order Pending"',
                [quantity, cart_id, product_code]
            );

            console.log('Update result:', updateResult);

            if (updateResult.affectedRows > 0) {
                console.log(`Successfully updated product ${product_code} quantity.`);
            } else {
                console.log(`Failed to update product ${product_code} quantity.`);
            }

        } else {
            // No existing cart item, so insert a new entry
            console.log(`No existing cart item for product ${product_code}. Inserting into cart.`);

            const cart_items_id = generateCartItemId(); // Generate unique code

            const [insertResult] = await db.query(
                'INSERT INTO cart_items (cart_items_id, cart_id, customer_id, product_code, quantity, status) VALUES (?, ?, ?, ?, ?, "Order Pending")',
                [cart_items_id, cart_id, user_id, product_code, quantity]
            );

            console.log('Insert result:', insertResult);

            if (insertResult.affectedRows > 0) {
                console.log(`Successfully inserted product ${product_code} into cart.`);
            } else {
                console.log(`Failed to insert product ${product_code} into cart.`);
            }
        }

        // Log user interaction in user_product_interactions
        const interactionQuery = `
            INSERT INTO user_product_interactions (customer_id, product_code, interaction_type)
            VALUES (?, ?, 'cart')
            ON DUPLICATE KEY UPDATE interaction_type = 'cart'
        `;
        await db.query(interactionQuery, [user_id, product_code]);

        res.status(200).json({ message: 'Product added to cart successfully!' });
        console.log('--- Request successfully completed ---');
    } catch (err) {
        console.error('Error during add-to-cart process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});





// Route to get cart item count
router.get('/cart-item-count', authenticateToken, async (req, res) => {
    const { user_id } = req;
    try {
        // Query to count items in the cart for the user
        const [rows] = await db.query(`
            SELECT SUM(quantity) AS itemCount
            FROM cart_items 
            WHERE customer_id = ? AND status = 'Order Pending'
        `, [user_id]);

        // Check if query result is valid and has rows
        const itemCount = rows && rows[0] && rows[0].itemCount ? rows[0].itemCount : 0;

        // Respond with the count of items in the cart
        res.status(200).json({ itemCount });
    } catch (err) {
        console.error('Error fetching cart item count:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Fetch Cart Items
router.get('/cart', authenticateToken, async (req, res) => {
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
                ci.cart_items_id,  
                ci.quantity
            FROM
                cart_items AS ci
            JOIN
                product AS p ON ci.product_code = p.product_code
            JOIN
                category AS c ON p.category_id = c.category_id
            WHERE
                ci.customer_id = ? AND ci.status = 'Order Pending'
        `, [user_id]);

        if (!rows || rows.length === 0) {
            return res.status(200).json({ items: [], totalPrice: 0 });
        }

        const totalPrice = rows.reduce((total, item) => total + item.price * item.quantity, 0);

        res.status(200).json({
            items: rows.map(item => ({
                cart_items_id: item.cart_items_id, // Include the cart item ID in the response
                product_id: item.product_id,
                product_code: item.product_code,
                product_name: item.product_name,
                description: item.description,
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

// Update cart item quantity
router.post('/cart-update-quantity', authenticateToken, async (req, res) => {
    const { cart_items_id, newQuantity } = req.body;

    console.log("CART ITEMS ID ---- ", cart_items_id);
    console.log("New Quantity ---- ", newQuantity);

    if (!cart_items_id || isNaN(newQuantity)) {
        return res.status(400).json({ message: 'Invalid cart item ID or quantity' });
    }

    if (newQuantity < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    try {
        const [result] = await db.query(`
        UPDATE cart_items 
        SET quantity = ? 
        WHERE cart_items_id = ? AND status = 'Order Pending'
      `, [newQuantity, cart_items_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.status(200).json({ message: 'Quantity updated successfully' });
    } catch (err) {
        console.error('Error updating cart item:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// CheckOut Page Backend
router.get('/products/:productCode', async (req, res) => {
    const { productCode } = req.params;
    console.log(productCode);
    try {
        // Query to fetch the product based on the product code
        const [rows] = await db.query(`
            SELECT
                p.product_id, 
                p.product_code, 
                p.product_name, 
                p.price, 
                p.description, 
                p.quantity, 
                c.category_name, 
                p.product_image, 
                p.product_discount
            FROM
                product AS p
                INNER JOIN
                category AS c
                ON 
                    p.category_id = c.category_id
                        WHERE p.product_code = ?
        `, [productCode]);

        // Check if product exists
        if (rows.length === 0) {
            return res.status(404).send('Product not found');
        }

        // Respond with the product details
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Error fetching product');
    }
});




router.get('/cart-item-count/:customer_id', async (req, res) => {
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


