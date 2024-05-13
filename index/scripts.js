// RECUPERO E INIZIALIZZAZIONE CARRELLO
let cartData = localStorage.getItem('cart'); // Recupero i dati del carrello (cart) dal localStorage.
let cart = []; // Inizializza 'cart' come un array vuoto. Questo sarà il nostro array di carrello se non ci sono dati nel localStorage o se c'è un errore nel parsing.
if (cartData) { // Controllo se ci sono dati nel cartData recuperato dal localStorage.
  try {
    cart = JSON.parse(cartData); // Tento di convertire il JSON stringified del carrello in un oggetto JavaScript.
    if (!Array.isArray(cart)) { // Controlla se il dato parsato è un array. Questo è importante perché stiamo aspettando un array di oggetti (gli elementi nel carrello).
      cart = []; // Se cart non è un array, resetta 'cart' a un array vuoto.
    }
  } catch (e) {  // Cattura qualsiasi errore che possa accadere durante il parsing del JSON, come stringhe malformate.
    cart = []; // In caso di errore nel parsing, imposta 'cart' a un array vuoto.
  }
}

//SETUP INIZIALE
let allItems = []; // Questo array sarà utilizzato per conservare tutti gli articoli recuperati dall'API.

// Il codice all'interno di questa funzione verrà eseguito una volta che il documento HTML sarà completamente caricato.
document.addEventListener("DOMContentLoaded", async function() {
  const url = "https://striveschool-api.herokuapp.com/api/product/"; // URL dell'API per ottenere i prodotti.
  const itemsContainer = document.getElementById('list-items'); // Ottengo il contenitore dove gli articoli saranno visualizzati.
  // Token di autenticazione necessario per l'API.
  const tokenAPI = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM5ZmI5M2Q2MzdmMzAwMTVhZGJmNmIiLCJpYXQiOjE3MTUwNzU5ODcsImV4cCI6MTcxNjI4NTU4N30.Mn-ZTbTLpn-SPTEYW7p_M3noajZAlf8qt8QjyaatmCU`;

  await fetchItems(); // Chiamo la funzione per recuperare gli articoli dall'API.

  // Aggiunge un ascoltatore di eventi 'storage' all'oggetto window. L'evento 'storage' si scatena quando 
  // cambiano gli elementi salvati nel localStorage o nel sessionStorage nel browser, 
  // ma solo per le modifiche effettuate da una diversa finestra o tab.
  window.addEventListener('storage', function(event) {  // 'event' è l'oggetto evento passato al gestore quando si verifica un evento di storage. Contiene dettagli sull'evento di storage.
    if (event.key === 'cart') { // Controlla se la chiave modificata è 'cart', il che significa che l'evento di storage è correlato ai dati del carrello.
      // Se è così, il codice seguente verrà eseguito.
        cart = JSON.parse(localStorage.getItem('cart')) || []; // Recupera il valore aggiornato di 'cart' dal localStorage e lo analizza da una stringa JSON a un oggetto JavaScript.
        // Se per qualche motivo `localStorage.getItem('cart')` ritorna null (ad esempio, se l'elemento non esiste), `JSON.parse(null)` restituirà null, quindi l'operatore `|| []` assicura che `cart` sarà impostato su un nuovo array vuoto.
        updateCartView(); // Chiamo la funzione `updateCartView` per aggiornare l'interfaccia utente con i nuovi dati del carrello. Questo potrebbe implicare la riscrittura del contenuto di un elemento HTML per riflettere gli articoli che sono ora nel 
        updateCartTotals(); // Chiamo la funzione `updateCartTotals` per calcolare e mostrare i nuovi totali del carrello, ad esempio il numero totale di articoli e il prezzo totale.
        updateButtonStates(); // Chiamo la funzione `updateButtonStates` per aggiornare lo stato dei pulsanti nell'interfaccia utente. Ad esempio, se un articolo è nel carrello, il pulsante per aggiungerlo potrebbe cambiare per mostrare che l'articolo è già stato aggiunto.
    }
  });

  // FUNZIONE PER IL RECUPERO DEGLI ARTICOLI
  async function fetchItems() {
    const response = await fetch(url, { headers: { Authorization: `Bearer ${tokenAPI}` } }); // Faccio una richiesta GET all'API.
    const items = await response.json(); // Converto la risposta in JSON.
    allItems = items; // Salvo gli articoli recuperati nell'array allItems.
    displayItems(items); // Chiamo la funzione per visualizzare gli articoli.
    updateButtonStates(); // Aggiorno lo stato dei pulsanti (ad esempio, se un articolo è nel carrello = cart-btn rimane in active).
  }

  // VISUALIZZAZIONE DEGLI ARTICOLI 
  function displayItems(items) {
    itemsContainer.innerHTML = ''; // Pulisco il contenitore degli articoli.
    items.forEach(item => {
       // Creo e configuro gli elementi HTML per ogni articolo.
      const itemCard = document.createElement('div'); // creo la card
      itemCard.className = 'products-card col';
      itemCard.dataset.productId = item._id;

      // CREO I 3 DIV PRINCIPALI CHE CONTERRANNO LE INFO DEI PRODOTTI
      const itemTitle = document.createElement('div'); // QUESTO DIV CONTERRA' NOME E IMMAGINE PRODOTTO
      itemTitle.className = 'product-title';
      itemCard.appendChild(itemTitle);

      const itemInfo = document.createElement('div'); //QUESTO DIV CONTERRA' DESCRIZIONE,BRAND E PREZZO PRODOTTO
      itemInfo.className = 'product-info';
      itemCard.appendChild(itemInfo);

      const itemButtons = document.createElement('div');// QUESTO DIV CONTERRA' I BUTTONS "CART-BTN" E "DETTAGLI"
      itemButtons.className = 'product-btns';
      itemCard.appendChild(itemButtons);

      const image = document.createElement('img');//IMMAGINE PRODOTTO
      image.src = item.imageUrl;
      image.alt = item.name;
      image.className = "itemimg";
      itemTitle.appendChild(image);

      const title = document.createElement('h6'); // NOME PRODOTTO
      title.textContent = item.name;
      itemTitle.appendChild(title);

      const brand = document.createElement('p'); // BRAND PRODOTTO
      brand.textContent = "Brand: " + item.brand;
      itemInfo.appendChild(brand);

      const price = document.createElement('p'); // PREZZO PRODOTTO
      price.textContent = "Prezzo: €" + item.price;
      itemInfo.appendChild(price);

      const addToCartButton = document.createElement('button'); // BOTTONE PER AGGIUNGERE PRODOTTO AL CARRELLO
      addToCartButton.className = 'btn cart-btn';
      addToCartButton.innerHTML = isProductInCart(item._id) ? '<i class="bi bi-cart-check-fill"></i>' : '<i class="bi bi-cart-plus"></i>';
      addToCartButton.classList.toggle('active', isProductInCart(item._id));
      addToCartButton.addEventListener('click', function(event) {
        event.preventDefault();
        toggleCartItem(item, addToCartButton);
      });
      itemButtons.appendChild(addToCartButton);

      const detailsButton = document.createElement('button'); // BOTTONE PER ANDARE ALLA PAGINA "DETTAGLIO" DEL SINGOLO PRODOTTO
      detailsButton.className = 'btn detl-btn';
      detailsButton.textContent = 'Dettagli';
      detailsButton.addEventListener('click', () => {
        window.location.href = `/Detail/detail.html?productId=${item._id}`;
      });
      itemButtons.appendChild(detailsButton);

      itemsContainer.appendChild(itemCard);
    });
  }

  // AGGIUNTA E RIMOZIONE DELI ARTICOLI DAL CARRELLO
  // Questa funzione aggiunge o rimuove un articolo dal carrello quando il pulsante corrispondente è cliccato.
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
  
  // CONTROLLO SE UN ARTICOLO E' NEL CARRELLO
  function isProductInCart(productId) {
    return cart.some(product => product._id === productId);  // Ritorna true se l'articolo è già nel carrello.
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

  // AGGIORNAMENTO DELLA VISTA DEL CARRELLO E DEL TOTALE DEI PRODOTTI E DEL PREZZO
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
  updateCartView()

  // CALCOLA E MOSTRA IL NUMERO TOTALE DEGLI ARTICOLI E IL PREZZO TOTALE NEL CARRELLO
  function updateCartTotals() {
    let totalItems = cart.length;
    let totalPrice = cart.reduce((total, item) => total + parseFloat(item.price), 0);
    let totalsDisplay = document.getElementById('cart-totals');
    totalsDisplay.textContent = `Totale articoli: ${totalItems}, Prezzo Totale: €${totalPrice.toFixed(2)}`;
  }

  // PULSANTE PER SVUOTARE IL CARRELLO
  const eraseOrderButton = document.querySelector('.eraseorder');
  // Questo gestore di eventi svuota completamente il carrello quando il pulsante "CANCELLA ORDINE" è cliccato.
  eraseOrderButton.addEventListener('click', () => {
    cart = []; // Svuoto l'array del carrello
    localStorage.setItem('cart', JSON.stringify(cart)); // Aggiorno il localStorage
    updateCartView(); // Aggiorno la visualizzazione del carrello
    updateCartTotals(); // Aggiorno i totali del carrello
    updateButtonStates(); // Aggiorno gli stati dei pulsanti
  });

   // Funzione di ricerca
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

});

