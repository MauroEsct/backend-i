import fs from 'fs';
const fsp = fs.promises;

export default class ProductManager {
    
    constructor(path) {
        this.path = path;
    }

    async #readProducts() {
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

    async #writeProducts(products) {
        await fsp.writeFile(this.path, JSON.stringify(products, null, 2));
    }

    #getNextId(products) {
        if (products.length === 0) {
            return 1;
        }
        const maxId = Math.max(...products.map(p => p.id));
        return maxId + 1;
    }

////////////
    async addProduct(product) {
        const { title, description, code, price, status = true, stock, category, thumbnails = [] } = product;
        
        if (!title || !description || !code || price === undefined || stock === undefined || !category) {
            throw new Error("Error: Todos los campos (title, description, code, price, stock, category) son obligatorios.");
        }

        const products = await this.#readProducts();
        
        if (products.some(p => p.code === code)) {
            throw new Error(`Error: Ya existe un producto con el código ${code}.`);
        }

        //nuevo producto
        const newProduct = {
            id: this.#getNextId(products),
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails 
        };

        // Agregar el producto al array
        products.push(newProduct);

        await this.#writeProducts(products);
        
        return newProduct;
    }
    async getProducts() {
        return await this.#readProducts();
    }

    ///Busca un producto por su ID.
    async getProductById(pid) {
        const products = await this.#readProducts();
        const product = products.find(p => p.id === Number(pid));
        
        if (!product) {
            throw new Error(`Producto con id ${pid} no encontrado.`);
        }
        
        return product;
    }

    /// Actualiza un producto por ID con los campos nuevos
    async updateProduct(pid, updatedFields) {
        if (updatedFields.hasOwnProperty('id')) {
            delete updatedFields.id;
        }

        const products = await this.#readProducts();
        // Buscamos el índice array
        const productIndex = products.findIndex(p => p.id === Number(pid));

        if (productIndex === -1) {
            throw new Error(`Producto con id ${pid} no encontrado.`);
        }

        // Actualizamos el producto
        products[productIndex] = { 
            ...products[productIndex],
            ...updatedFields
        };

        await this.#writeProducts(products);
        return products[productIndex];
    }

    /// Eliminar un producto por su ID
    async deleteProduct(pid) {
        const products = await this.#readProducts();
        
        const productExists = products.some(p => p.id === Number(pid));
        if (!productExists) {
            throw new Error(`Producto con id ${pid} no encontrado.`);
        }

        const filteredProducts = products.filter(p => p.id !== Number(pid));
        
        await this.#writeProducts(filteredProducts);
    }
}