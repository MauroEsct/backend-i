import { Router } from 'express';
import { productModel } from '../models/product.model.js';

const router = Router();

// --- GET /api/products
router.get('/', async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;

        let filter = {};
        if (query) {
            if (query.toLowerCase() === 'true' || query.toLowerCase() === 'false') {
                filter.status = query.toLowerCase() === 'true';
            } else {
                filter.category = query;
            }
        }

        let sortOptions = {};
        if (sort) {
            sortOptions.price = sort === 'asc' ? 1 : -1;
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sortOptions,
            lean: true
        };

        const result = await productModel.paginate(filter, options);

        const baseUrl = req.protocol + '://' + req.get('host') + req.baseUrl;
        
        const prevLink = result.hasPrevPage 
            ? `${baseUrl}?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`
            : null;

        const nextLink = result.hasNextPage 
            ? `${baseUrl}?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`
            : null;

        res.status(200).json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// --- GET 
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productModel.findById(pid);
        
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        res.status(200).json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// --- POST 
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' });
        }

        const newProduct = await productModel.create({
            title, description, code, price, stock, category, thumbnails
        });

        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// --- PUT
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updateData = req.body;

        const updatedProduct = await productModel.findByIdAndUpdate(pid, updateData, { new: true });
        
        if (!updatedProduct) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        res.status(200).json({ status: 'success', payload: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// --- DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await productModel.findByIdAndDelete(pid);

        if (!deletedProduct) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        res.status(200).json({ status: 'success', message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;