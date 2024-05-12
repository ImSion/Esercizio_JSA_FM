let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allItems = [];

document.addEventListener("DOMContentLoaded", async function() {
  const url = "https://striveschool-api.herokuapp.com/api/product/";
  const itemsContainer = document.getElementById('list-items');
  const tokenAPI = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM5ZmI5M2Q2MzdmMzAwMTVhZGJmNmIiLCJpYXQiOjE3MTUwNzU5ODcsImV4cCI6MTcxNjI4NTU4N30.Mn-ZTbTLpn-SPTEYW7p_M3noajZAlf8qt8QjyaatmCU`;

  await fetchItems();

  window.addEventListener('storage', function(event) {
    if (event.key === 'cart') {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartView();
        updateCartTotals();
        updateButtonStates();
    }
  });


  async function fetchItems() {
    const response = await fetch(url, { headers: { Authorization: `Bearer ${tokenAPI}` } });
    const items = await response.json();
    allItems = items;
    displayItems(items);
    updateButtonStates();
  }

  function displayItems(items) {
    itemsContainer.innerHTML = '';
    items.forEach(item => {
      const itemCard = document.createElement('div');
      itemCard.className = 'products-card col';
      itemCard.dataset.productId = item._id;

      const itemTitle = document.createElement('div');
      itemTitle.className = 'product-title';
      itemCard.appendChild(itemTitle);

      const itemInfo = document.createElement('div');
      itemInfo.className = 'product-info';
      itemCard.appendChild(itemInfo);

      const itemButtons = document.createElement('div');
      itemButtons.className = 'product-btns';
      itemCard.appendChild(itemButtons);

      const image = document.createElement('img');
      image.src = item.imageUrl;
      image.alt = item.name;
      image.className = "itemimg";
      itemTitle.appendChild(image);

      const title = document.createElement('h6');
      title.textContent = item.name;
      itemTitle.appendChild(title);

      const brand = document.createElement('p');
      brand.textContent = "Brand: " + item.brand;
      itemInfo.appendChild(brand);

      const price = document.createElement('p');
      price.textContent = "Prezzo: €" + item.price;
      itemInfo.appendChild(price);

      const addToCartButton = document.createElement('button');
      addToCartButton.className = 'btn cart-btn';
      addToCartButton.innerHTML = isProductInCart(item._id) ? '<i class="bi bi-cart-check-fill"></i>' : '<i class="bi bi-cart-plus"></i>';
      addToCartButton.classList.toggle('active', isProductInCart(item._id));
      addToCartButton.addEventListener('click', function(event) {
        event.preventDefault();
        toggleCartItem(item, addToCartButton);
      });
      itemButtons.appendChild(addToCartButton);

      const detailsButton = document.createElement('button');
      detailsButton.className = 'btn detl-btn';
      detailsButton.textContent = 'Dettagli';
      detailsButton.addEventListener('click', () => {
        window.location.href = `/Detail/detail.html?productId=${item._id}`;
      });
      itemButtons.appendChild(detailsButton);

      itemsContainer.appendChild(itemCard);
    });
  }

  function toggleCartItem(item, button) {
    const productId = item._id;
    const isInCart = isProductInCart(productId);
    if (!isInCart) {
      cart.push({...item, quantity: 1});  // Aggiunge l'item al carrello
      button.innerHTML = '<i class="bi bi-cart-check-fill"></i>';
      button.classList.add('active');
    } else {
      cart = cart.filter(p => p._id !== productId);  // Rimuove l'item dal carrello
      button.innerHTML = '<i class="bi bi-cart-plus"></i>';
      button.classList.remove('active');
    }
    localStorage.setItem('cart', JSON.stringify(cart));  // Aggiorna il localStorage
    updateCartView();  // Aggiorna la vista del carrello
    updateCartTotals();  // Aggiorna i totali del carrello
  }
  
  function isProductInCart(productId) {
    return cart.some(product => product._id === productId);  // Corretto da product.id a product._id
  }
  
  function updateButtonStates() {
    const cartButtons = document.querySelectorAll('.cart-btn');
    cartButtons.forEach(button => {
      const productId = button.closest('.products-card').dataset.productId;
      const isInCart = isProductInCart(productId);
      button.innerHTML = isInCart ? '<i class="bi bi-cart-check-fill"></i>' : '<i class="bi bi-cart-plus"></i>';
      button.classList.toggle('active', isInCart);
    });
  }

  function updateCartView() {
    let cartContainer = document.getElementById('cart');
    cartContainer.innerHTML = '';
    cart.forEach(product => {
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

      cartContainer.appendChild(productInCart);
    });
  }

  function updateCartTotals() {
    let totalItems = cart.length;
    let totalPrice = cart.reduce((total, item) => total + parseFloat(item.price), 0);
    let totalsDisplay = document.getElementById('cart-totals');
    totalsDisplay.textContent = `Totale articoli: ${totalItems}, Prezzo Totale: €${totalPrice.toFixed(2)}`;
  }

  const eraseOrderButton = document.querySelector('.eraseorder');
  eraseOrderButton.addEventListener('click', () => {
    cart = []; // Svuota l'array del carrello
    localStorage.setItem('cart', JSON.stringify(cart)); // Aggiorna il localStorage
    updateCartView(); // Aggiorna la visualizzazione del carrello
    updateCartTotals(); // Aggiorna i totali del carrello
    updateButtonStates(); // Aggiorna gli stati dei pulsanti
  });
});
