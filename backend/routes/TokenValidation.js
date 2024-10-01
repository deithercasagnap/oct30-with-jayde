const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to validate token (assumed to be already defined)
const authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const [rows] = await db.query('SELECT user_id FROM tokens WHERE token = ? AND expires_at > NOW()', [token]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        req.user_id = rows[0].user_id; // Attach user_id to request object
        next(); // Proceed to the next middleware/route
    } catch (err) {
        console.error('Token Validation Backend Error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Route to validate token
router.get('/validate-token', authenticateToken, (req, res) => {
    // If we reach this point, the token is valid
    res.json({ message: 'Token is valid', user_id: req.user_id });
});

module.exports = router;