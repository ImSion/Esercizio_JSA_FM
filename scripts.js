document.addEventListener("DOMContentLoaded", function() {
  const url = "https://striveschool-api.herokuapp.com/api/product/";
  const itemsContainer = document.getElementById('list-items');
  const tokenAPI = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM5ZmI5M2Q2MzdmMzAwMTVhZGJmNmIiLCJpYXQiOjE3MTUwNzU5ODcsImV4cCI6MTcxNjI4NTU4N30.Mn-ZTbTLpn-SPTEYW7p_M3noajZAlf8qt8QjyaatmCU`;
  let allItems = [];
  let cart = [];

  async function fetchItems() {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${tokenAPI}` }
    });
    const items = await response.json();
    allItems = items;
    displayItems(items);
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

      const description = document.createElement('p');
      description.textContent = item.description;
      itemInfo.appendChild(description);

      const brand = document.createElement('p');
      brand.textContent = "Brand: " + item.brand;
      itemInfo.appendChild(brand);

      const price = document.createElement('p');
      price.textContent = "Prezzo: € " + item.price;
      itemInfo.appendChild(price);

      // Bottoni per aggiungere il carrello e aprire il prodotto in dettaglio
      const addToCartButton = document.createElement('button');
      addToCartButton.className = 'btn cart-btn';
      addToCartButton.innerHTML = '<i class="bi bi-cart-plus"></i>';
      itemButtons.appendChild(addToCartButton);

      const detailsButton = document.createElement(`button`)
      detailsButton.className = `btn detl-btn`
      detailsButton.textContent = `dettagli`
      itemButtons.appendChild(detailsButton)

      itemsContainer.appendChild(itemCard);
    });
    setupCardListeners();
  }

  function setupCardListeners() {
    const cartButtons = document.querySelectorAll('.cart-btn');
    cartButtons.forEach(button => {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        const productId = this.closest('.products-card').dataset.productId;
        const product = allItems.find(prod => prod._id === productId);
  
        let isInCart = cart.some(p => p._id === productId);
        if (!isInCart) {
          cart.push(product);
          updateCartView();
          this.innerHTML = `<i class="bi bi-cart-check-fill"></i>`;
          this.classList.add('active');  // Aggiunge la classe active per mantenere lo stile hover
        } else {
          cart = cart.filter(p => p._id !== productId);
          updateCartView();
          this.innerHTML = '<i class="bi bi-cart-plus"></i>';
          this.classList.remove('active');  // Rimuove la classe active per tornare allo stile normale
        }
      });
    });
  }

  function updateCartView() {
    let cartContainer = document.getElementById('cart');
    cartContainer.innerHTML = "";
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
    updateCartTotals()
  }

  function updateCartTotals() {
    let totalItems = cart.length;
    let totalPrice = cart.reduce((total, item) => total + parseFloat(item.price), 0);
    let totalsDisplay = document.getElementById('cart-totals');
    if (totalsDisplay) {  // Controlla se l'elemento esiste prima di tentare di modificare il suo contenuto
        totalsDisplay.textContent = `Totale articoli: ${totalItems}, Prezzo Totale: ${totalPrice.toFixed(2)}€`;
    }
}

  const eraseOrderButton = document.querySelector('.eraseorder');
  eraseOrderButton.addEventListener('click', () => {
      cart = []; // Svuota l'array del carrello
      updateCartView(); // Aggiorna la visualizzazione del carrello
      updateCartTotals(); // Aggiorna gli elementi totali e il loro prezzo totale
  
      // Trova tutti i badge "Acquistato" e li resetto se cancello l'ordine
      const badges = document.querySelectorAll('.buybadge');
      badges.forEach(badge => {
          if (!badge.classList.contains('badge-dnone')) {
              badge.classList.add('badge-dnone');
          }
      });
  
      // Resetta tutti i pulsanti "Aggiungi al carrello" se sono stati disabilitati
      const buttons = document.querySelectorAll('.cart-btn');
      buttons.forEach(button => {
          button.textContent = "Aggiungi al carrello";
          if (button.classList.contains('disabled')) {
              button.classList.remove('disabled');
          }
      });
  });

  // Costruisco la funzione per la logica del search
  const search = document.querySelector(".search-wrapper");
  const input = search.querySelector("input");

  search.addEventListener("click", () => {
    if (!input.matches(":focus")) {
      search.classList.add("activesrc");
    }
  });

  const srcInput = document.querySelector("input[type='search']");

  srcInput.addEventListener("input", () => {
    const searchText = srcInput.value.toLowerCase();
    if (searchText.length >= 2) {
      const filteredItems = allItems.filter(item => item.name.toLowerCase().includes(searchText));
      displayItems(filteredItems);
    } else if (searchText.length === 0) {
      displayItems(allItems);
    }
  });

  search.addEventListener("mouseleave", () => {
    if (!input.matches(":focus") && !input.value.trim()) {
      search.classList.remove("activesrc");
    }
  });

  fetchItems();
});
