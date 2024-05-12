let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('productId');

    if (productId) {
        fetchProductDetails(productId);
    }

    window.addEventListener('storage', function(event) {
        if (event.key === 'cart') {
            cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (productId) {
                const product = cart.find(p => p.id === productId);
                updateAddButton(product);
                updateCartView();
                updateCartTotals();
            }
        }
    });

    async function fetchProductDetails(productId) {
        const tokenAPI = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM5ZmI5M2Q2MzdmMzAwMTVhZGJmNmIiLCJpYXQiOjE3MTUwNzU5ODcsImV4cCI6MTcxNjI4NTU4N30.Mn-ZTbTLpn-SPTEYW7p_M3noajZAlf8qt8QjyaatmCU`;
        const url = `https://striveschool-api.herokuapp.com/api/product/${productId}`;
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${tokenAPI}` }
        });
        const product = await response.json();
        displayProductDetails(product);
    }

    function displayProductDetails(product) {
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-image').src = product.imageUrl;
        document.getElementById('product-image').alt = product.name;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-brand').textContent = `Brand: ${product.brand}`;
        document.getElementById('product-price').textContent = `Prezzo: €${product.price}`;
        updateAddButton(product);
    }

    function updateAddButton(product) {
        const productDetail = document.getElementById('product-detail-container');
        const addToCartButton = document.createElement('button');
        addToCartButton.className = 'btn detail-cart-btn';
        const isInCart = isProductInCart(product.id);
        addToCartButton.innerHTML = isInCart ? '<i class="bi bi-cart-check-fill"></i>' : '<i class="bi bi-cart-plus"></i>';
        addToCartButton.classList.toggle('active', isInCart);
        productDetail.appendChild(addToCartButton);

        addToCartButton.addEventListener('click', () => {
            toggleCartItem(product, addToCartButton);
        });
    }

    function toggleCartItem(product, button) {
        const isInCart = isProductInCart(product.id);
        if (!isInCart) {
            cart.push({...product, quantity: 1});
            button.innerHTML = '<i class="bi bi-cart-check-fill"></i>';
            button.classList.add('active');
        } else {
            cart = cart.filter(p => p.id !== product.id);
            button.innerHTML = '<i class="bi bi-cart-plus"></i>';
            button.classList.remove('active');
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartView();
        updateCartTotals();
    }

    function isProductInCart(productId) {
        return cart.some(product => product.id === productId);
    }

    function updateCartView() {
        const cartContainer = document.getElementById('cart');
        cartContainer.innerHTML = "";
        cart.forEach(product => {
            cartContainer.appendChild(createCartProductElement(product));
        });
    }

    function createCartProductElement(product) {
        const productInCart = document.createElement('div');
        productInCart.className = 'cart-product';

        const productImg = document.createElement('img');
        productImg.src = product.imageUrl;
        productImg.alt = product.name;
        productImg.className = 'cart-product-img';
        productInCart.appendChild(productImg);

        const productName = document.createElement('span');
        productName.className = 'cart-product-text';
        productName.textContent = product.name;
        productInCart.appendChild(productName);

        const productPrice = document.createElement('span');
        productPrice.className = 'cart-product-text';
        productPrice.textContent = `Prezzo: €${product.price}`;
        productInCart.appendChild(productPrice);

        return productInCart;
    }

    function updateCartTotals() {
        const totalItems = cart.length;
        const totalPrice = cart.reduce((total, item) => total + parseFloat(item.price), 0);
        const totalsDisplay = document.getElementById('cart-totals');
        totalsDisplay.textContent = `Totale articoli: ${totalItems}, Prezzo Totale: €${totalPrice.toFixed(2)}`;
    }
});
