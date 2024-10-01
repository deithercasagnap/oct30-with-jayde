const express = require('express');
const router = express.Router();
const db = require('../db');
const crypto = require('crypto');


const TOKEN_EXPIRATION_TIME = 3600000; // 1 hour

router.post('/customer-login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Fetch user data from the database
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = rows[0];


        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if a token already exists for the user
        const [existingTokenRows] = await db.query('SELECT * FROM tokens WHERE user_id = ? AND token_status = ?', [user.customer_id, 'Active']);

        if (existingTokenRows.length > 0) {
            return res.status(400).json({ message: 'User already logged in' });
        }

        // Generate a random token
        const token = crypto.randomBytes(64).toString('hex');

        // Store the token in the database
        await db.query('INSERT INTO tokens (user_id, token, expires_at) VALUES (?, ?, ?)', [
            user.customer_id,
            token,
            new Date(Date.now() + TOKEN_EXPIRATION_TIME)
        ]);

        // Respond with success message, token, user_id, username, and first_name
        res.json({
            message: 'Login successful',
            token: token,
            user_id: user.customer_id,
            username: user.username,
            first_name: user.first_name
        });
    } catch (err) {
        // Log only the message
        console.error('Error during login:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// // Logout endpoint
// router.post('/logout', (req, res) => {
//     const token = req.headers['authorization']?.split(' ')[1]; // Extract token from headers

//     if (!token) {
//         return res.status(400).json({ message: 'No token provided.' });
//     }

//     // Add token to blacklist (you could also store it in a DB)
//     blacklistToken(token); // This function should handle adding the token to a blacklist

//     res.status(200).json({ message: 'Logged out successfully.' });
// });



module.exports = router;