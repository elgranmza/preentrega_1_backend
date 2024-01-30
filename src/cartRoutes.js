const express = require('express');
const fs = require('fs');
const router = express.Router();


router.use(express.json());

router.post('/', (req, res) => {

    const cartId = generateUniqueId();

    const newCart = {
        id: cartId,
        products: []
    };

    fs.writeFile('cart.json', JSON.stringify(newCart), (err) => {
        if (err) {
            console.error('Error al crear el carrito:', err);
            res.status(500).send('Error interno del servidor');
        } else {
            res.status(201).json(newCart);
        }
    });
});

router.get('/:cid', (req, res) => {
    const cartId = req.params.cid;

    fs.readFile('cart.json', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo del carrito:', err);
            res.status(500).send('Error interno del servidor');
        } else {
            const cart = JSON.parse(data);
            res.json(cart.products);
        }
    });
});


router.post('/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    fs.readFile('cart.json', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo del carrito:', err);
            res.status(500).send('Error interno del servidor');
        } else {
            const cart = JSON.parse(data);

            const existingProduct = cart.products.find(item => item.product === productId);

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            fs.writeFile('cart.json', JSON.stringify(cart), (err) => {
                if (err) {
                    console.error('Error al escribir en el archivo del carrito:', err);
                    res.status(500).send('Error interno del servidor');
                } else {
                    res.status(201).json(cart);
                }
            });
        }
    });
});

function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}

module.exports = router;
