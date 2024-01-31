const express = require('express');
const ProductManager = require('./productManager');
const cartRouter = require('./cartRouter'); 

const app = express();
const port = 8080;

const productManager = new ProductManager('./products.json');

const productsRouter = express.Router();


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


app.use('/products', productsRouter);

app.use('/carts', cartRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
