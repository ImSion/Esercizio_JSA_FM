const url = "https://striveschool-api.herokuapp.com/api/product/"; // definisco l'url dell'API


 // verifica che il contenuto del DOM sia completamente caricato prima di eseguire la funzione.
document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById('items-form'); //riferimento al form HTML con ID 'items-form'.
  const itemsContainer = document.getElementById('bo-items-cards');// riferimento al div con ID 'bo-items-cards' che verrà usato per visualizzare gli oggetti creati.

  // Definisco una funzione asincrona per recuperare gli oggetti dal server.
  async function fetchItems() { 
      // Effettuo una richiesta GET asincrona all'API.    
      const response = await fetch(url, { 
          // Imposto nell'headers l'autorizzazione passandogli il token.
          headers: {
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM5ZmI5M2Q2MzdmMzAwMTVhZGJmNmIiLCJpYXQiOjE3MTUwNzU5ODcsImV4cCI6MTcxNjI4NTU4N30.Mn-ZTbTLpn-SPTEYW7p_M3noajZAlf8qt8QjyaatmCU`
          }
      });
      // converto la risposta in JSON
      const items = await response.json();
      // richiamo la funzione per visualizzare gli oggetti.
      displayItems(items);
  }

  // definisco una funzione asincrona per creare un nuovo oggetto tramite POST.
  async function createItem(name, imageUrl, description, brand,  price) {
      const newItem = { name, imageUrl, description, brand,  price }; // Creo un oggetto con i dati da inviare al server.
      const response = await fetch(url, { // Effettuo una richiesta POST asincrona all'API.
          method: 'POST',
          headers: {
              'Content-Type': 'application/json', // Specifico che il tipo di contenuto inviato è JSON.
              // Inserisco il token di autorizzazione.
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM5ZmI5M2Q2MzdmMzAwMTVhZGJmNmIiLCJpYXQiOjE3MTUwNzU5ODcsImV4cCI6MTcxNjI4NTU4N30.Mn-ZTbTLpn-SPTEYW7p_M3noajZAlf8qt8QjyaatmCU`
          },
          body: JSON.stringify(newItem) // Converto l'oggetto newItem in una stringa JSON e lo imposta come corpo della richiesta.
      });
      return response.json(); // Restituisce l'elemento creato
  }

  // creo una funzione per visualizzare gli oggetti nel DOM.
  function displayItems(items) {
    itemsContainer.innerHTML = ''; // Pulisco gli elementi esistenti
    items.forEach(item => { // Itero su ogni oggetto ricevuto.
        const itemCard = document.createElement('div'); // Creo un nuovo elemento div.
        itemCard.className = 'item-card col justify-content-center align-items-center'; // Assegno la classe 'item-card' al nuovo div.

        const title = document.createElement('h6');
        title.textContent = item.name;
        itemCard.appendChild(title);
        
        const image = document.createElement('img');
        image.src = item.imageUrl;
        image.alt = item.name;
        image.className = "bo-itemimg"
        itemCard.appendChild(image);

        const description = document.createElement('span');
        description.textContent = item.description;
        itemCard.appendChild(description);

        const brand = document.createElement('span');
        brand.textContent = "Brand: " + item.brand;
        itemCard.appendChild(brand);

        const price = document.createElement('span');
        price.textContent = "Prezzo: € " + item.price;
        itemCard.appendChild(price);

        itemsContainer.appendChild(itemCard);
    });
}

  form.addEventListener('submit', async function(event) {
      event.preventDefault(); // Previene il comportamento di default del form
      const name = document.getElementById('name').value;
      const description = document.getElementById('description').value;
      const brand = document.getElementById('brand').value;
      const imageUrl = document.getElementById('item-img').value;
      const price = document.getElementById('price').value;

      const createdItem = await createItem(name, description, brand, imageUrl, price);
      console.log('Elemento creato:', createdItem);
      fetchItems(); // Aggiorna la lista degli elementi
  });

  fetchItems(); // Carica gli elementi esistenti all'avvio
});

