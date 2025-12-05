import { Router } from 'express';
import { cartModel } from '../models/cart.model.js';
import { productModel } from '../models/product.model.js';

const router = Router();

// --- POST /api/carts
router.post('/', async (req, res) => {
    try {
        const newCart = await cartModel.create({ products: [] });
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// --- GET
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findById(cid);
        
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        res.status(200).json({ status: 'success', payload: cart.products });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// --- POST
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        
        const cart = await cartModel.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        const productIndex = cart.products.findIndex(p => p.product._id.toString() === pid);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            const productExists = await productModel.findById(pid);
            if (!productExists) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

            cart.products.push({ product: pid, quantity: 1 });
        }

        const result = await cart.save();
        res.status(200).json({ status: 'success', payload: result });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartModel.findById(cid);
        
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        cart.products = cart.products.filter(p => p.product._id.toString() !== pid);

        const result = await cart.save();
        res.status(200).json({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body; 

        const cart = await cartModel.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        cart.products = products; 
        
        const result = await cart.save();
        res.status(200).json({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await cartModel.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        const productIndex = cart.products.findIndex(p => p.product._id.toString() === pid);
        
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            res.status(200).json({ status: 'success', payload: cart });
        } else {
            res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// --- DELETE
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findById(cid);
        
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        cart.products = []; 

        const result = await cart.save();
        res.status(200).json({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;