import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager('src/db/products.json');

// --- GET /api/products/ ---
router.get('/', async (req, res) => {
    try {
        const products = await manager.getProducts();
        
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// --- GET /api/products/:pid ---
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params; 
        
        const product = await manager.getProductById(pid);
        
        res.status(200).json(product);

    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
});

// --- POST /api/products/ ---
router.post('/', async (req, res) => {
    try {
        const newProduct = req.body; 
        
        const product = await manager.addProduct(newProduct);
        
        res.status(201).json({ status: 'success', payload: product });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

//actualizar un producto por id
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedFields = req.body;
        
        const updatedProduct = await manager.updateProduct(pid, updatedFields);
        
        res.status(200).json({ status: 'success', payload: updatedProduct });

    } catch (error) {
        if (error.message.includes("no encontrado")) {
            res.status(404).json({ status: 'error', message: error.message });
        } else {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
});

// --- DELETE /api/products/:pid ---
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        await manager.deleteProduct(pid);
        
        res.status(200).json({ status: 'success', message: 'Producto eliminado' });

    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
});
export default router;