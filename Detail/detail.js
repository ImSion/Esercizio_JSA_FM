// Recupero l'array del carrello dal localStorage e lo converte da stringa JSON a oggetto JavaScript, o inizializza un array vuoto se non esiste nulla nel localStorage.
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Ascolto l'evento 'DOMContentLoaded' che viene scatenato quando il DOM della pagina è completamente caricato e pronto.
document.addEventListener("DOMContentLoaded", function() {

    // Creo un oggetto URLSearchParams basato sui parametri di query presenti nell'URL della pagina.
    const params = new URLSearchParams(window.location.search);
    
    // Recupero il valore del parametro 'productId' dall'URL, se presente.
    const productId = params.get('productId');

    // Se esiste un productId, chiamo la funzione fetchProductDetails per recuperare e visualizzare i dettagli di quel prodotto.
    if (productId) {
        fetchProductDetails(productId);
    }

    // Ascolto l'evento 'storage' che viene scatenato quando ci sono cambiamenti nel localStorage.
    window.addEventListener('storage', function(event) {
        // Controllo se la chiave modificata è 'cart'.
        if (event.key === 'cart') {
            // Aggiorno l'array cart con i dati più recenti dal localStorage, o inizializza un array vuoto se non esistono dati.
            cart = JSON.parse(localStorage.getItem('cart')) || [];
            // Se esiste un productId, cerco quel prodotto specifico all'interno del carrello.
            if (productId) {
                const product = cart.find(p => p.id === productId);
                // Aggiorno lo stato del pulsante di aggiunta al carrello, la visualizzazione del carrello e i totali del carrello.
                updateAddButton(product);
                updateCartView();
                updateCartTotals();
            }
        }
    });

    // Definisco una funzione asincrona per recuperare i dettagli di un prodotto specifico da un'API.
    async function fetchProductDetails(productId) {
        const tokenAPI = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM5ZmI5M2Q2MzdmMzAwMTVhZGJmNmIiLCJpYXQiOjE3MTUwNzU5ODcsImV4cCI6MTcxNjI4NTU4N30.Mn-ZTbTLpn-SPTEYW7p_M3noajZAlf8qt8QjyaatmCU`; // Token di autenticazione per l'API.
        const url = `https://striveschool-api.herokuapp.com/api/product/${productId}`; // Costruisco l'URL per il prodotto specifico.
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${tokenAPI}` }
        }); // Effettuo una chiamata fetch all'API con l'autorizzazione necessaria.
        const product = await response.json(); // Converto la risposta JSON in un oggetto JavaScript.
        displayProductDetails(product); // Chiamo la funzione per visualizzare i dettagli del prodotto.
    }

    // Visualizzo i dettagli del prodotto recuperato dall'API sul DOM della pagina.
    function displayProductDetails(product) {
        document.getElementById('product-name').textContent = product.name; // Mostro il nome del prodotto.
        document.getElementById('product-image').src = product.imageUrl; // Imposto l'immagine del prodotto.
        document.getElementById('product-image').alt = product.name; // Imposto un testo alternativo per l'immagine.
        document.getElementById('product-description').textContent = product.description; // Mostro la descrizione del prodotto.
        document.getElementById('product-brand').textContent = `Brand: ${product.brand}`; // Mostro il marchio del prodotto.
        document.getElementById('product-price').textContent = `Prezzo: €${product.price}`; // Mostro il prezzo del prodotto.
        updateAddButton(product); // Aggiorno lo stato del pulsante di aggiunta al carrello.
    }

    // Aggiorno lo stato del pulsante di aggiunta al carrello a seconda se il prodotto è già nel carrello o meno.
    function updateAddButton(product) {
        const productDetail = document.getElementById('product-detail-container'); // Ottiene il contenitore dei dettagli del prodotto.
        const addToCartButton = document.createElement('button'); // Creo un nuovo pulsante.
        addToCartButton.className = 'btn detail-cart-btn'; // Imposto la classe CSS del pulsante.
        const isInCart = isProductInCart(product.id); // Controllo se il prodotto è nel carrello.
        addToCartButton.innerHTML = isInCart ? '<i class="bi bi-cart-check-fill"></i>' : '<i class="bi bi-cart-plus"></i>'; // Imposta l'icona del pulsante in base al suo stato nel carrello.
        addToCartButton.classList.toggle('active', isInCart); // Alterno la classe 'active' basata sullo stato nel carrello.
        productDetail.appendChild(addToCartButton); // Aggiungo il pulsante al contenitore dei dettagli del prodotto.

        // Aggiungo un gestore di eventi click che alterna lo stato del prodotto nel carrello quando cliccato.
        addToCartButton.addEventListener('click', () => {
            toggleCartItem(product, addToCartButton);
        });
    }

    // Alterno lo stato di un prodotto nel carrello: aggiunge o rimuove.
    function toggleCartItem(product, button) {
        const isInCart = isProductInCart(product.id); // Verifico se il prodotto è nel carrello.
        if (!isInCart) {
            cart.push({...product, quantity: 1}); // Aggiungo il prodotto al carrello se non c'è.
            button.innerHTML = '<i class="bi bi-cart-check-fill"></i>'; // Cambio l'icona del pulsante.
            button.classList.add('active'); // Aggiungo la classe 'active' al pulsante.
        } else {
            cart = cart.filter(p => p.id !== product.id); // Rimuovo il prodotto dal carrello se c'è.
            button.innerHTML = '<i class="bi bi-cart-plus"></i>'; // Reimposto l'icona del pulsante.
            button.classList.remove('active'); // Rimuovo la classe 'active' dal pulsante.
        }
        localStorage.setItem('cart', JSON.stringify(cart)); // Aggiorno il carrello nel localStorage.
        updateCartView(); // Aggiorno la visualizzazione del carrello.
        updateCartTotals(); // Aggiorno i totali del carrello.
    }

    // Verifico se un prodotto specifico è nel carrello.
    function isProductInCart(productId) {
        return cart.some(product => product.id === productId); // Restituisce true se il prodotto è nel carrello.
    }

    // Aggiorno la visualizzazione del carrello sul DOM.
    function updateCartView() {
        const cartContainer = document.getElementById('cart'); // Ottiene il contenitore del carrello.
        cartContainer.innerHTML = ""; // Pulisco il contenitore del carrello.
        cart.forEach(product => {
            cartContainer.appendChild(createCartProductElement(product)); // Aggiungo ogni prodotto nel carrello al contenitore del carrello.
        });
    }
    updateCartView()

    // Creo un elemento DOM per un prodotto nel carrello.
    function createCartProductElement(product) {
        const productInCart = document.createElement('div'); // Creo un nuovo div.
        productInCart.className = 'cart-product'; // Imposto la classe CSS.

        const productImg = document.createElement('img'); // Creo un elemento immagine.
        productImg.src = product.imageUrl; // Imposto il src dell'immagine.
        productImg.alt = product.name; // Imposto il testo alternativo dell'immagine.
        productImg.className = 'cart-product-img'; // Imposto la classe CSS dell'immagine.
        productInCart.appendChild(productImg); // Aggiungo l'immagine al div del prodotto.

        const productName = document.createElement('span'); // Creo un elemento span per il nome.
        productName.className = 'cart-product-text'; // Imposto la classe CSS.
        productName.textContent = product.name; // Imposto il testo del nome del prodotto.
        productInCart.appendChild(productName); // Aggiungo il nome al div del prodotto.

        const productPrice = document.createElement('span'); // Creo un elemento span per il prezzo.
        productPrice.className = 'cart-product-text'; // Imposto la classe CSS.
        productPrice.textContent = `Prezzo: €${product.price}`; // Imposto il testo del prezzo.
        productInCart.appendChild(productPrice); // Aggiungo il prezzo al div del prodotto.

        return productInCart; // Restituisco l'elemento del prodotto creato.
    }

    // Aggiorno i totali del carrello sul DOM.
    function updateCartTotals() {
        const totalItems = cart.length; // Calcolo il numero totale di articoli nel carrello.
        const totalPrice = cart.reduce((total, item) => total + parseFloat(item.price), 0); // Calcolo il prezzo totale degli articoli nel carrello.
        const totalsDisplay = document.getElementById('cart-totals'); // Ottiene l'elemento che mostra i totali del carrello.
        totalsDisplay.textContent = `Totale articoli: ${totalItems}, Prezzo Totale: €${totalPrice.toFixed(2)}`; // Imposta il testo dei totali del carrello.
    }
  
    // PULSANTE PER SVUOTARE IL CARRELLO
    const eraseOrderButton = document.querySelector('.eraseorder');
    // Questo gestore di eventi svuota completamente il carrello quando il pulsante "CANCELLA ORDINE" è cliccato.
    eraseOrderButton.addEventListener('click', () => {
    cart = []; // Svuoto l'array del carrello
    localStorage.setItem('cart', JSON.stringify(cart)); // Aggiorno il localStorage
    updateCartView(); // Aggiorno la visualizzazione del carrello
    updateCartTotals(); // Aggiorno i totali del carrello
    });

});

 