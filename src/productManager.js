const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    saveProducts() {
        const data = JSON.stringify(this.products, null, 2);
        fs.writeFileSync(this.path, data);
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error("Todos los campos del producto son obligatorios");
        }
        if (this.products.find((p) => p.code === code)) {
            throw new Error("El código del producto ya existe");
        }
        const product = {
            id: this.products.length + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };
        this.products.push(product);
        this.saveProducts();
    }

    getProducts(limit) {
        if (limit) {
            return this.products.slice(0, limit);
        }
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((p) => p.id == id);
        if (!product) {
            console.log("Not found");
            return null;
        }
        return product;
    }

    updateProduct(id, updatedData) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            throw new Error("Producto no encontrado");
        }
        this.products[productIndex] = { ...this.products[productIndex], ...updatedData };
        this.saveProducts();
    }

    deleteProduct(id) {
        const newProducts = this.products.filter((p) => p.id !== id);
        if (newProducts.length === this.products.length) {
            throw new Error("Producto no encontrado");
        }
        this.products = newProducts;
        this.saveProducts();
    }
}

module.exports = ProductManager;
