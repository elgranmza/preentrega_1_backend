const express = require('express');
const fs = require('fs');

const cartRouter = express.Router();

const CARTS_FILE_PATH = './carts.json';


cartRouter.post('/', (req, res) => {
    try {
        const cartId = generateUniqueId();
        const newCart = {
            id: cartId,
            products: []
        };
        saveCart(newCart);
        res.status(201).json(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


cartRouter.get('/:cid', (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = getCartById(cartId);
        if (!cart) {
            res.status(404).json({ error: 'Cart not found' });
        } else {
            res.json(cart.products);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


cartRouter.post('/:cid/product/:pid', (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = 1; 

        let cart = getCartById(cartId);
        if (!cart) {
            res.status(404).json({ error: 'Cart not found' });
            return;
        }

        let productIndex = cart.products.findIndex(p => p.product === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        saveCart(cart);
        res.status(201).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


function generateUniqueId() {
    return Date.now().toString(); 
}


function saveCart(cart) {
    fs.writeFileSync(CARTS_FILE_PATH, JSON.stringify(cart, null, 2));
}


function getCartById(cartId) {
    try {
        const cartsData = fs.readFileSync(CARTS_FILE_PATH, 'utf-8');
        const carts = JSON.parse(cartsData);
        return carts.find(cart => cart.id === cartId);
    } catch (error) {
        return null;
    }
}

module.exports = cartRouter;
