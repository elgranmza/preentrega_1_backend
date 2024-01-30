const express = require('express');
const bodyParser = require('body-parser');
const productsRouter = require('./productsRoutes');
const cartRouter = require('./cartRoutes');

const app = express();
const PORT = 8080;


app.use(bodyParser.json());


app.use('/api/products', productsRouter);

app.use('/api/carts', cartRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

