import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import ProductManager from './managers/ProductManager.js';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;
const manager = new ProductManager('src/db/products.json');

app.engine('handlebars', handlebars.engine());
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const io = new Server(httpServer);
app.use((req, res, next) => {
    req.io = io;
    next();
});

// --- Rutas ---
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    const products = await manager.getProducts();
    socket.emit('products', products);
});