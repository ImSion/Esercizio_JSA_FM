const url = "https://striveschool-api.herokuapp.com/api/product/"; // definisco l'url dell'API


 // verifica che il contenuto del DOM sia completamente caricato prima di eseguire la funzione.
document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById('items-form'); //riferimento al form HTML con ID 'items-form'.
  const itemsContainer = document.getElementById('bo-items-cards');// riferimento al div con ID 'bo-items-cards' che verrà usato per visualizzare gli oggetti creati.

  // creo una funzione asincrona per recuperare gli oggetti dal server.
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

  // creo una funzione asincrona per creare un nuovo oggetto tramite POST.
  async function createItem(name, description, brand, imageUrl, price) {
      const newItem = { name, description, brand, imageUrl, price }; // Creo un oggetto con i dati da inviare al server.
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

  // creo una funzione asincrona che accetta come parametro `itemId`, ovvero l'id dell'elemento da eliminare.
  async function deleteItem(itemId) {
    // Eseguo una richiesta fetch asincrona concatenando `url` base dell'API e `itemId` per puntare specificatamente all'elemento da eliminare.
    const response = await fetch(url + itemId, { // `await` è usato per attendere che la promise restituita da fetch sia risolta prima di procedere.
        method: 'DELETE', // Imposto il metodo HTTP della richiesta a 'DELETE', indicando che l'operazione desiderata è l'eliminazione di un elemento.
        headers: { // Imposto gli headers della richiesta. In questo caso, include un header 'Authorization' per l'autenticazione,
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM5ZmI5M2Q2MzdmMzAwMTVhZGJmNmIiLCJpYXQiOjE3MTUwNzU5ODcsImV4cCI6MTcxNjI4NTU4N30.Mn-ZTbTLpn-SPTEYW7p_M3noajZAlf8qt8QjyaatmCU`
        }
    });
    // Controllo se la risposta HTTP ha avuto successo (cioè, stato HTTP 200-299).
    if (response.ok) { // `response.ok` restituisce true se lo status è compreso tra 200 e 299, indicando che la richiesta è stata eseguita con successo.
        console.log('Elemento eliminato con successo'); // Loggo un messaggio nella console per indicare che l'elemento è stato eliminato con successo.
        fetchItems(); // Chiamo la funzione `fetchItems` per ricaricare e aggiornare la lista degli elementi.
    } else {
      // Se la risposta non è riuscita, loggo un messaggio di errore nella console del browser.
        console.error('Errore nell\'eliminazione dell\'elemento'); // Questo blocco else viene eseguito se lo status della risposta non è compreso tra 200 e 299.
    }
  }

  // creo una funzione asincrona che prende un parametro `id`, ovvero l'ID dell'elemento che deve essere aggiornato.
  async function saveChanges(id) {
    // Crea un oggetto contenente i nuovi valori per l'item, recuperati dai campi di input presenti nel modal.
    const updatedItem = {
      // Raccolgo i valori aggiornati dai campi di input del modal e li memorizza nell'oggetto.
      name: document.getElementById('edit-name').value,
      description: document.getElementById('edit-description').value,
      brand: document.getElementById('edit-brand').value,
      imageUrl: document.getElementById('edit-imageUrl').value,
      price: document.getElementById('edit-price').value
    };
    
    // Effettuo una richiesta asincrona utilizzando "put" all'URL specificato per l'API, concatenando l'ID dell'item per specificare quale item aggiornare.
    const response = await fetch(url + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM5ZmI5M2Q2MzdmMzAwMTVhZGJmNmIiLCJpYXQiOjE3MTUwNzU5ODcsImV4cCI6MTcxNjI4NTU4N30.Mn-ZTbTLpn-SPTEYW7p_M3noajZAlf8qt8QjyaatmCU`
      },
      body: JSON.stringify(updatedItem)
    });
    // Invia una richiesta PUT all'API per aggiornare l'item con i nuovi valori. Include i dettagli necessari come headers e il corpo della richiesta.
  
    if (response.ok) {
      console.log('Elemento aggiornato con successo');
      fetchItems();
      // Se l'aggiornamento è riuscito, stampo un messaggio di successo, ricarico la lista degli items e chiude il modal.
  
      bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
      // Utilizzo un metodo di Bootstrap per nascondere il modal una volta che le modifiche sono state salvate con successo.
    } else {
      console.error('Errore nell\'aggiornamento dell\'elemento');
      // Se la richiesta fallisce, stampo un messaggio di errore.
    }
  }

  // Creo la funzione che riempirà in automatico i campi nel modal con le info dell'elemento che intendo modificare
  function fillModal(item) {
    //imposto i valori dei campi di input nel modal di modifica ai valori correnti dell'item selezionato
    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-description').value = item.description;
    document.getElementById('edit-brand').value = item.brand;
    document.getElementById('edit-imageUrl').value = item.imageUrl;
    document.getElementById('edit-price').value = item.price;

    // creo il riferimento al form di modifica all'interno del modal.
    const editForm = document.getElementById('edit-form');
    
    editForm.onsubmit = async function(event) {
      event.preventDefault(); // Previene il comportamento di default del form quando viene inviato (cioè, il caricamento della pagina).
      
      saveChanges(item._id);// Chiamo la funzione saveChanges, passando l'ID dell'item, per salvare le modifiche fatte.
      
    };
  }

  // creo una funzione per visualizzare gli oggetti nel DOM.
  function displayItems(items) {
    itemsContainer.innerHTML = ''; // Pulisco gli elementi esistenti
    console.log(items); // visualizzo l'array che si popola correttamente
    items.forEach(item => { // Itero su ogni oggetto ricevuto.
        const itemCard = document.createElement('div'); // Creo un nuovo elemento div.
        itemCard.className = 'item-card'; // Assegno le classi al nuovo div.

        // creo gli elementi che popoleranno la card
        const title = document.createElement('h6');
        title.textContent = item.name;
        itemCard.appendChild(title);
        
        const image = document.createElement('img');
        image.src = item.imageUrl;
        image.alt = item.name;
        image.className = "bo-itemimg"
        itemCard.appendChild(image);

        const description = document.createElement('p');
        description.textContent = "Descrizione: " + item.description;
        itemCard.appendChild(description);

        const brand = document.createElement('p');
        brand.textContent = "Brand: " + item.brand;
        itemCard.appendChild(brand);

        const price = document.createElement('p');
        price.textContent = "Prezzo: € " + item.price;
        itemCard.appendChild(price);


        // Aggiungo il bottone di modifica
        const editButton = document.createElement('button'); // creo il bottone nell'html all'interno di "itemCard", assegnandolo alla variabile EditButton
        editButton.textContent = 'Modifica'; // il testo visualizzato sul bottone
        editButton.className = 'btn edit-btn'; // assegno le classi al bottone
        editButton.setAttribute('data-bs-toggle', 'modal'); // Imposto l'attributo data-bs-toggle sul bottone per abilitare il controllo del modal Bootstrap.
        editButton.setAttribute('data-bs-target', '#editModal'); // Imposto data-bs-target per indicare l'id del modal che deve essere attivato quando si clicca il bottone.
        editButton.onclick = function() { // Aggiungo un gestore evento onclick al bottone che chiama la funzione fillModal, passando le info dell'item corrente.
          fillModal(item);
        };
        itemCard.appendChild(editButton); // Aggiungo il bottone di modifica al div itemCard.

        // Aggiungo il bottone di eliminazione
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Elimina'; 
        deleteButton.className = 'btn delete-btn'; // assegno le classi al bottone
        deleteButton.onclick = function() { 
            deleteItem(item._id); // Assumendo che ogni item abbia un campo _id
        };
        itemCard.appendChild(deleteButton); // Aggiungo il bottone Elimina al div itemCard.



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

