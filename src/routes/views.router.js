import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager('src/db/products.json');

router.get('/', async (req, res) => {
    const products = await manager.getProducts();
    res.render('home', { products });
});

router.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts');
});

export default router;