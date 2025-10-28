import fs from 'fs';
const fsp = fs.promises;

export default class CartManager {

    constructor(path) {
        this.path = path;
    }

    async #readCarts() {
        try {
            const fileContent = await fsp.readFile(this.path, 'utf-8');
            if (fileContent.trim() === "") {
                return [];
            }
            return JSON.parse(fileContent);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }

    async #writeCarts(carts) {
        await fsp.writeFile(this.path, JSON.stringify(carts, null, 2));
    }

    #getNextId(carts) {
        if (carts.length === 0) {
            return 1;
        }
        const maxId = Math.max(...carts.map(c => c.id));
        return maxId + 1;
    }

    async createCart() {
        const carts = await this.#readCarts();
                const newCart = {
            id: this.#getNextId(carts),
            products: []
        };

        carts.push(newCart);
        await this.#writeCarts(carts);
        
        return newCart;
    }

    /// buscar por carrito por id
    async getCartById(cid) {
        const carts = await this.#readCarts();
        const cart = carts.find(c => c.id === Number(cid));
        
        if (!cart) {
            throw new Error(`Carrito con id ${cid} no encontrado.`);
        }
        
        return cart;
    }
    async addProductToCart(cid, pid) {
        const carts = await this.#readCarts();
        
        const cartIndex = carts.findIndex(c => c.id === Number(cid));
        if (cartIndex === -1) {
            throw new Error(`Carrito con id ${cid} no encontrado.`);
        }

        const cart = carts[cartIndex];

        const productIndex = cart.products.findIndex(p => p.product === Number(pid));

        if (productIndex !== -1) {

            cart.products[productIndex].quantity += 1;
        } else {

            cart.products.push({
                product: Number(pid),
                quantity: 1
            });
        }

        carts[cartIndex] = cart;
        
        await this.#writeCarts(carts);
        
        return cart;
    }
}