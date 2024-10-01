const express = require('express');
const router = express.Router();
const db = require('../db');


const statusUpdateQueue = [];
let isProcessing = false;

function processQueue() {
    if (isProcessing || statusUpdateQueue.length === 0) return;

    isProcessing = true;
    const { product_code, status, resolve, reject } = statusUpdateQueue.shift();

    db.query(`
        UPDATE \`cart_items\`
        SET status = ?
        WHERE product_code = ?
    `, [status, product_code])
        .then(() => {
            console.log(`Product status updated for ${product_code} to ${status}`);
            resolve();
            isProcessing = false;
            processQueue(); // Process the next item in the queue
        })
        .catch((error) => {
            console.error(`Error updating product status for ${product_code}:`, error);
            reject(error);
            isProcessing = false;
            processQueue(); // Continue processing other items in the queue even if one fails
        });
}

function addToQueue(product_code, status) {
    return new Promise((resolve, reject) => {
        statusUpdateQueue.push({ product_code, status, resolve, reject });
        processQueue();
    });
}

module.exports = { addToQueue };
