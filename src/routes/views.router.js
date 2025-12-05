import { Router } from 'express';
import { productModel } from '../models/product.model.js';
import { cartModel } from '../models/cart.model.js';

const router = Router();

// --- Vista de Productos
router.get('/products', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        
        const result = await productModel.paginate({}, { 
            page, 
            limit, 
            lean: true 
        });

        res.render('products', {
            products: result.docs,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            totalPages: result.totalPages
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});

// --- Vista de Carrito ---
router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findById(cid).populate('products.product').lean();

        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }

        res.render('cart', {
            cid: cart._id,
            products: cart.products
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});

export default router;