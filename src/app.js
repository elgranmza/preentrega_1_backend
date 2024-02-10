const express = require('express');
const ProductManager = require('./productManager');
const CartManager = require('./CartManager');
const productsRouter = require('./productRouter');
const cartRouter = require('./cartRouter');

const app = express();
const port = 8080;

// Agregar middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager('./products.json');

productsRouter.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts(limit);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid, 10);
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Crear una instancia de CartManager
const cartManager = new CartManager('./carts.json');

// Ruta para crear un nuevo carrito
app.post('/carts', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use('/products', productsRouter);
app.use('/cart', cartRouter);

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});
