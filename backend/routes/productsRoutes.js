const express = require('express');
const router = express.Router();
const db = require('../db');

// Route to get products based on the most frequent category for the user
router.get('/product-user', async (req, res) => {
    try {
        const customerId = req.query.customerId; // Retrieve customer ID from query parameters

        if (!customerId) {
            return res.status(400).send('customerId is required');
        }

        // Query to get products based on the most frequent category for the customer
        let query = `
        SELECT
    p.product_id,
    p.product_code,
    p.product_name,
    p.description,

    p.price,
    p.size,
    p.expiration_date,
    c.category_name
FROM
    product AS p
JOIN
    category AS c ON p.category_id = c.category_id
WHERE
    p.category_id = (
        SELECT
            p2.category_id
        FROM
            cart_items AS ci
        JOIN
            product AS p2 ON ci.product_code = p2.product_code
        WHERE
            ci.customer_id = ?
        GROUP BY
            p2.category_id
        ORDER BY
            COUNT(p2.category_id) DESC
        LIMIT 1
    );
`;

        // Execute the query, passing the customerId as a parameter
        const [rows] = await db.query(query, [customerId]);

        // Respond with product recommendations
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products based on the most frequent category:', error);
        res.status(500).send('Error fetching products');
    }
});

router.get('/products', async (req, res) => {
    try {
        // Fetch all products and their categories
        const [rows] = await db.query(`
            SELECT p.product_id, p.product_code, p.product_name, p.price ,p.description, p.quantity, c.category_name, p.product_image,  p.product_discount, 
                p.product_status
            FROM product p
            INNER JOIN category c ON p.category_id = c.category_id
        `);

        // Respond with product details including categories
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
});




// Route to get top products from different categories
router.get('/products-top-mix-picks', async (req, res) => {
    try {
        // Fetch top products from different categories
        const [rows] = await db.query(`
       SELECT
	p.product_id, 
	p.product_code, 
	p.product_name, 
	p.price, 
	p.description, 
	p.quantity, 
    p.product_discount, 
                p.product_status,
	c.category_name, 
	COUNT(DISTINCT user_product_interactions.product_code) AS interaction_count, 
	p.product_image
FROM
	product AS p
	JOIN
	category AS c
	ON 
		p.category_id = c.category_id
	JOIN
	user_product_interactions
	ON 
		p.product_code = user_product_interactions.product_code
WHERE
	user_product_interactions.interaction_type = 'Order'
GROUP BY
	p.product_id, 
	p.product_code, 
	p.product_name, 
	p.price, 
	p.description, 
	p.quantity, 
	c.category_name
ORDER BY
	interaction_count DESC;


        `);

        // Respond with top picked products by category
        res.json(rows);
    } catch (error) {
        console.error('Error fetching top user picks by category:', error);
        res.status(500).send('Error fetching top user picks by category');
    }
});



// Route to get top 4 user-picked products for interaction view
router.get('/products-top-picks', async (req, res) => {
    try {
        // Fetch the top 4 products based on the highest interaction count
        const [rows] = await db.query(`
         SELECT
	p.product_id, 
	p.product_code, 
	p.product_name, 
	p.price, 
	p.description, 
	p.quantity, 
	c.category_name, 
	COUNT(DISTINCT user_product_interactions.product_code) AS interaction_count, 
	p.product_image
FROM
	product AS p
	JOIN
	category AS c
	ON 
		p.category_id = c.category_id
	JOIN
	user_product_interactions
	ON 
		p.product_code = user_product_interactions.product_code
WHERE
	user_product_interactions.interaction_type = 'view'
GROUP BY
	p.product_id, 
	p.product_code, 
	p.product_name, 
	p.price, 
	p.description, 
	p.quantity, 
	c.category_name
ORDER BY
	interaction_count DESC
LIMIT 4;`);

        // Respond with top picked products
        res.json(rows);
    } catch (error) {
        console.error('Error fetching top user picks:', error);
        res.status(500).send('Error fetching top user picks');
    }
});



// for cart recommended products excluding the current user
router.get('/recommend-products', async (req, res) => {
    try {
        // const currentUserId = req.headers.customer_id;
        const currentUserId = req.headers.customer_id;

        console.log(`User ID: ${currentUserId}`);
        // Debugging: Log the customer_id received
        // console.log('Current User ID:', currentUserId);

        if (!currentUserId) {
            console.log('No customer_id found in request headers');
            return res.status(400).json({ error: 'Missing customer_id in request headers' });
        }

        // Fetch the top 4 cart interactions excluding current user
        const [rankedInteractions] = await db.query(`
          
              SELECT 
    p.product_id, 
    p.product_code, 
    p.product_name, 
    p.price, 
    p.description, 
    p.quantity, 
    c.category_name, 
    COUNT(DISTINCT user_product_interactions.product_code) AS interaction_count, 
    p.product_image
FROM
    product AS p
JOIN
    category AS c
    ON p.category_id = c.category_id
JOIN
    user_product_interactions
    ON p.product_code = user_product_interactions.product_code
WHERE
    user_product_interactions.interaction_type = 'order'
    AND user_product_interactions.customer_id != ?
GROUP BY
    p.product_id, 
    p.product_code, 
    p.product_name, 
    p.price, 
    p.description, 
    p.quantity, 
    c.category_name, 
    p.product_image
ORDER BY
    interaction_count DESC
           LIMIT 4;
        `, [currentUserId]);

        // Debugging: Log the query result
        console.log('Recommended Products:', rankedInteractions);

        // If no products are found, log and send a message
        if (rankedInteractions.length === 0) {
            console.log('No recommended products found for the user.');
            return res.status(404).json({ message: 'No recommended products found' });
        }

        res.json(rankedInteractions);
    } catch (error) {
        // Debugging: Log any error that occurs during execution
        console.error('Error recommending products:', error);
        res.status(500).send('Error recommending products');
    }
});


router.post('/products-recommendations', async (req, res) => {
    const { product_code } = req.body;

    console.log('Received request to fetch recommendations for product_code:', product_code);

    try {
        // Fetch the category_id of the product based on product_code
        console.log(`Querying for product with product_code: ${product_code}`);
        const [selectedProductRows] = await db.query(
            `SELECT category_id, product_id FROM product WHERE product_code = ?`,
            [product_code]
        );

        if (selectedProductRows.length === 0) {
            console.log('No product found for the provided product_code:', product_code);
            return res.status(404).json({ error: 'Product not found' });
        }

        const { category_id, product_id } = selectedProductRows[0];
        console.log(`Product found. Category ID: ${category_id}, Product ID: ${product_id}`);

        // Fetch products from the same category, excluding the selected product
        console.log(`Querying for recommended products in category: ${category_id} excluding product_id: ${product_id}`);
        const [recommendedProducts] = await db.query(`
            SELECT
                p.product_id, 
                p.category_id, 
                p.product_code, 
                p.product_name, 
                p.price, 
                p.description, 
                p.quantity, 
				p.product_discount, 
                p.product_image,
                p.product_status
            FROM
                product AS p
            WHERE 
                p.category_id = ?
                AND p.product_code != ?
            ORDER BY
                CASE 
                    WHEN p.product_status = 'Discounted' THEN 1 
                    ELSE 2 
                END
        `, [category_id, product_id]);

        console.log(`Found ${recommendedProducts.length} recommended products`);

        // Respond with recommended products
        res.json(recommendedProducts);
    } catch (error) {
        console.error('Error fetching recommended products:', error);
        res.status(500).send('Error fetching recommendations');
    }
});

router.get('/sticky-components', async (req, res) => {
    const { hairType, hairTexture, hairVirgin, hairColor, hairRebonded } = req.query;

    console.log('--------- STICKY COMPONENT -------');
    console.log('Received parameters:', req.query);

    try {
        // Base query to fetch active products
        let query = 'SELECT * FROM product WHERE product_status IN ("active", "Discounted")';

        // List of possible search terms
        const searchTerms = [];
        const queryParams = [];

        // Check each parameter and add to searchTerms array if provided
        if (hairType) {
            searchTerms.push('LOWER(description) LIKE ?');
            queryParams.push(`%${hairType.toLowerCase()}%`);
        }

        if (hairTexture) {
            searchTerms.push('LOWER(description) LIKE ?');
            queryParams.push(`%${hairTexture.toLowerCase()}%`);
        }

        if (hairVirgin) {
            searchTerms.push('LOWER(description) LIKE ?');
            queryParams.push(`%${hairVirgin.toLowerCase()}%`);
        }

        if (hairColor) {
            searchTerms.push('LOWER(description) LIKE ?');
            queryParams.push(`%${hairColor.toLowerCase()}%`);
        }

        if (hairRebonded) {
            searchTerms.push('LOWER(description) LIKE ?');
            queryParams.push(`%${hairRebonded.toLowerCase()}%`);
        }

        // Add the search conditions to the query if there are any
        if (searchTerms.length > 0) {
            query += ' AND (' + searchTerms.join(' OR ') + ')';  // Join conditions with OR
        }

        // Add a LIMIT clause to the query (e.g., limit to 4 products)
        query += ' LIMIT 4';

        console.log('Final query to execute:', query);
        console.log('Query parameters:', queryParams);

        const [products] = await db.query(query, queryParams);

        console.log('Fetched products:', products);

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).send('Server error');
    }
});




router.get('/products-bundle-recommendation', async (req, res) => {
    console.log('--- BUNDLE PRODUCTS ---');

    try {
        // Fetch all products and their categories
        const [rows] = await db.query(`
         SELECT
    p.product_id,
    p.category_id,
    p.product_code,
    p.product_name,
    p.price,
    p.description,
    p.quantity,
    p.product_discount,
    p.product_image,
    p.product_status 
FROM
    product AS p 
WHERE
    p.product_status = 'Discounted' 
ORDER BY
    CASE
        WHEN p.product_status = 'Discounted' THEN 1 
        ELSE 2 
    END
LIMIT 4;  

    `);

        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
});


module.exports = router;
