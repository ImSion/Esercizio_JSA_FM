document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('productId');

    if (productId) {
        fetchProductDetails(productId);
    }
});

async function fetchProductDetails(productId) {
    const tokenAPI = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM5ZmI5M2Q2MzdmMzAwMTVhZGJmNmIiLCJpYXQiOjE3MTUwNzU5ODcsImV4cCI6MTcxNjI4NTU4N30.Mn-ZTbTLpn-SPTEYW7p_M3noajZAlf8qt8QjyaatmCU`;
    const url = `https://striveschool-api.herokuapp.com/api/product/${productId}`;
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${tokenAPI}` }
    });
    const product = await response.json();

    if (product) {
        displayProductDetails(product);
    }
}

function displayProductDetails(product) {
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-image').src = product.imageUrl;
    document.getElementById('product-image').alt = product.name;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-brand').textContent = `Brand: ${product.brand}`;
    document.getElementById('product-price').textContent = `Prezzo: €${product.price}`;
}

// Bottoni per aggiungere il carrello e aprire il prodotto in dettaglio
const productDetail = document.getElementById(`product-detail-container`)
const addToCartButton = document.createElement('button');
addToCartButton.className = 'btn cart-btn';
addToCartButton.innerHTML = '<i class="bi bi-cart-plus"></i>';
productDetail.appendChild(addToCartButton);