const express = require('express');
const CartManager = require('./CartManager');

const cartRouter = express.Router();
const cartManager = new CartManager('./carts.json');

cartRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

cartRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid, 10);
        const cart = await cartManager.getCartById(cartId);
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

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid, 10);
        const productId = parseInt(req.params.pid, 10);
        const cart = await cartManager.addProductToCart(cartId, productId);
        res.status(201).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = cartRouter;
