const socket = io();
const productsList = document.getElementById('products-list');
const createProductForm = document.getElementById('create-product-form');

socket.on('products', (data) => {
    renderProducts(data);
});

function renderProducts(products) {
    productsList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${product.title}</strong> - $${product.price} 
            <button onclick="deleteProduct(${product.id})">Eliminar</button>
        `;
        productsList.appendChild(li);
    });
}

createProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newProduct = {
        title: document.getElementById('title').value,
        price: Number(document.getElementById('price').value),
        code: document.getElementById('code').value,
        stock: Number(document.getElementById('stock').value),
        category: document.getElementById('category').value,
        description: "Descripción genérica",
        status: true
    };

    await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
    });
    
    createProductForm.reset();
});

//eliminar producto
async function deleteProduct(id) {
    await fetch(`/api/products/${id}`, {
        method: 'DELETE'
    });
}