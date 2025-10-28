import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const manager = new CartManager('src/db/carts.json');

// --- POST /api/carts/ ---
router.post('/', async (req, res) => {
    try {
        const newCart = await manager.createCart();
        
        res.status(201).json({ status: 'success', payload: newCart });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// --- GET /api/carts/:cid ---
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await manager.getCartById(cid);
        
        res.status(200).json(cart.products);

    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
});

// --- POST /api/carts/:cid/product/:pid ---
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        
        const updatedCart = await manager.addProductToCart(cid, pid);
        
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
});
export default router;