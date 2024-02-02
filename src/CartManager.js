const fs = require('fs').promises;

class CartManager {
    constructor(cartFilePath) {
        this.cartFilePath = cartFilePath;
    }

    async generateCartId() {
        try {
            const cartsData = await fs.readFile(this.cartFilePath, 'utf-8');
            const carts = JSON.parse(cartsData);
            if (carts.length === 0) {
                return 1;
            }
            const lastCart = carts[carts.length - 1];
            const newCartId = lastCart.id + 1;
            await fs.writeFile(this.lastCartIdPath, JSON.stringify({ id: newCartId }));
            return newCartId;
        } catch (error) {
            throw error;
        }
    }

    async createCart() {
        try {
            const cartId = await this.generateCartId();
            const newCart = {
                id: cartId,
                products: []
            };
            await this.saveCart(newCart);
            return newCart;
        } catch (error) {
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const carts = await this.getCarts();
            return carts.find(cart => cart.id === cartId);
        } catch (error) {
            throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const quantity = 1;
            let cart = await this.getCartById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }
            let productIndex = cart.products.findIndex(p => p.product === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
            await this.saveCart(cart);
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async saveCart(cart) {
        try {
            const cartsData = await fs.readFile(this.cartFilePath, 'utf-8');
            const carts = JSON.parse(cartsData);
            carts.push(cart);
            await fs.writeFile(this.cartFilePath, JSON.stringify(carts, null, 2));
        } catch (error) {
            throw error;
        }
    }

    async getCarts() {
        try {
            const cartsData = await fs.readFile(this.cartFilePath, 'utf-8');
            return JSON.parse(cartsData);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CartManager;
