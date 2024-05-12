const url = "https://striveschool-api.herokuapp.com/api/product/"; // definisco l'url dell'API
// definisco la variabile tokenAPI in modo da non dover copiare l'intero codice ogni volta
const tokenAPI = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM5ZmI5M2Q2MzdmMzAwMTVhZGJmNmIiLCJpYXQiOjE3MTUwNzU5ODcsImV4cCI6MTcxNjI4NTU4N30.Mn-ZTbTLpn-SPTEYW7p_M3noajZAlf8qt8QjyaatmCU`


  // verifica che il contenuto del DOM sia completamente caricato prima di eseguire la funzione.
  document.addEventListener("DOMContentLoaded", function() {
  
  // Definisco l'elemento del bottone collapse e l'icona
  const collapseButton = document.querySelector('.colapse-btn');
  const collapseIcon = collapseButton.querySelector('i');

  // Gestisco l'evento di apertura del collapse
  const formCollapse = document.getElementById('createForm');
  formCollapse.addEventListener('show.bs.collapse', function () {
    collapseIcon.classList.remove('bi-plus-lg');
    collapseIcon.classList.add('bi-dash');
  });

  // Gestisco l'evento di chiusura del collapse
  formCollapse.addEventListener('hide.bs.collapse', function () {
    collapseIcon.classList.remove('bi-dash');
    collapseIcon.classList.add('bi-plus-lg');
  });
  
  // Da qui inizia la logica di funzione del backoffice
  const form = document.getElementById('items-form'); //riferimento al form HTML con ID 'items-form'.
  const itemsContainer = document.getElementById('bo-items-cards');// riferimento al div con ID 'bo-items-cards' che verrà usato per visualizzare gli oggetti creati.
  let allItems = [] // creo un array vuoto dove memorizzare gli items che serviranno per la funzione ricerca 

  // creo una funzione asincrona per collegare l'endpoint e poterlo popolare.
  async function fetchItems() { 
      // Effettuo una richiesta GET asincrona all'API.    
      const response = await fetch(url, { 
          // Imposto nell'headers l'autorizzazione passandogli il token.
          headers: {
              'Authorization': `Bearer ${tokenAPI}`
          }
      });
      // converto la risposta in JSON
      const items = await response.json();
      allItems = items // memorizzo una copia degli elementi originali
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
              'Authorization': `Bearer ${tokenAPI}`
          },
          body: JSON.stringify(newItem) // Converto l'oggetto newItem in una stringa JSON e lo imposta come corpo della richiesta.
      });

      if (response.ok) { // Verifico se la richiesta è stata eseguita con successo.
        clearFormFields(); // se l'elemento è stato creato con successo, parte la funzione per pulire i campi del form.
        displaySuccessMessage(); // Funzione per mostrare il messaggio di successo.
      }

      return response.json(); // Restituisce l'elemento creato
  }

  // creo la funzione per pulire i campi del form una volta creato l'elemento correttamente
  function clearFormFields() {
    document.getElementById('name').value = '';
    document.getElementById('description').value = '';
    document.getElementById('brand').value = '';
    document.getElementById('item-img').value = '';
    document.getElementById('price').value = '';
  }

  // creo le funzioni per visualizzare un messaggio in base all'evento (Creazione,Modificare,Eliminare)
  function displaySuccessMessage() {
    const successMsg = document.getElementById('events-message'); // punto l'elemento HTML id="success-message"
    successMsg.textContent = "Prodotto Inserito Correttamente!"; // Imposto il messaggio di successo.
    successMsg.style.display = 'block'; // Mostra il messaggio.
  
    // Nascondo il messaggio dopo 3 secondi
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
  }

  function displayEditMessage() {
    const successMsg = document.getElementById('events-message'); // punto l'elemento HTML id="success-message"
    successMsg.textContent = "Prodotto Modificato Correttamente!"; // Imposto il messaggio di successo.
    successMsg.style.display = 'block'; // Mostra il messaggio.
  
    // Nascondo il messaggio dopo 3 secondi
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
  }

  function displayDeleteMessage() {
    const successMsg = document.getElementById('events-message'); // punto l'elemento HTML id="success-message"
    successMsg.textContent = "Prodotto Eliminato Correttamente!"; // Imposto il messaggio di successo.
    successMsg.style.display = 'block'; // Mostra il messaggio.
  
    // Nascondo il messaggio dopo 3 secondi
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
  }

  // creo una funzione asincrona che accetta come parametro `itemId`, ovvero l'id dell'elemento da eliminare.
  async function deleteItem(itemId) {
    // Eseguo una richiesta fetch asincrona concatenando `url` base dell'API e `itemId` per puntare specificatamente all'elemento da eliminare.
    const response = await fetch(url + itemId, { // `await` è usato per attendere che la promise restituita da fetch sia risolta prima di procedere.
        method: 'DELETE', // Imposto il metodo HTTP della richiesta a 'DELETE', indicando che l'operazione desiderata è l'eliminazione di un elemento.
        headers: { // Imposto gli headers della richiesta. In questo caso, include un header 'Authorization' per l'autenticazione,
            'Authorization': `Bearer ${tokenAPI}`
        }
    });
    // Controllo se la risposta HTTP ha avuto successo (cioè, stato HTTP 200-299).
    if (response.ok) { // `response.ok` restituisce true se lo status è compreso tra 200 e 299, indicando che la richiesta è stata eseguita con successo.
        console.log('Elemento eliminato con successo'); // Loggo un messaggio nella console per indicare che l'elemento è stato eliminato con successo.
        fetchItems(); // Chiamo la funzione `fetchItems` per ricaricare e aggiornare la lista degli elementi.
        displayDeleteMessage()
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
        'Authorization': `Bearer ${tokenAPI}`
      },
      body: JSON.stringify(updatedItem)
    });
    // Invia una richiesta PUT all'API per aggiornare l'item con i nuovi valori. Include i dettagli necessari come headers e il corpo della richiesta.
  
    if (response.ok) {
      console.log('Elemento aggiornato con successo');
      displayEditMessage();
      fetchItems();
      // Se l'aggiornamento è riuscito, stampo un messaggio di successo, ricarico la lista degli items e chiude il modal.
  
      // Utilizzo un metodo di Bootstrap per nascondere il modal una volta che le modifiche sono state salvate con successo.
      bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
      
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

        // creo i 3 div che conterranno gli elementi per poter ottimizzare l'UI
        const itemTitle = document.createElement(`div`)
        itemTitle.className = `item-title`
        itemCard.appendChild(itemTitle)
        
        const itemInfo = document.createElement(`div`)
        itemInfo.className = `item-info`
        itemCard.appendChild(itemInfo)

        const itemButtons = document.createElement(`div`)
        itemButtons.className = `item-btns`
        itemCard.appendChild(itemButtons)

        // creo gli elementi che popoleranno la card
        const title = document.createElement('h6');
        title.textContent = item.name;
        itemTitle.appendChild(title);
        
        const image = document.createElement('img');
        image.src = item.imageUrl;
        image.alt = item.name;
        image.className = "bo-itemimg"
        itemTitle.appendChild(image);

        // Creazione del bottone che apre il modale
        const modalButton = document.createElement('button');
        modalButton.className = 'btn descr-btn';
        modalButton.textContent = 'Descrizione';
        modalButton.setAttribute('data-bs-toggle', 'modal');
        modalButton.setAttribute('data-bs-target', `#modal-${item._id}`);
        itemInfo.appendChild(modalButton);

        // Creazione del modale
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = `modal-${item._id}`;
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-labelledby', `modalLabel-${item._id}`);
        modal.setAttribute('aria-hidden', 'true');
        document.body.appendChild(modal);  // Appendo il modale al body

        // Struttura interna del modale
        const modalDialog = document.createElement('div');
        modalDialog.className = 'modal-dialog';
        modal.appendChild(modalDialog);

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalDialog.appendChild(modalContent);

        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        modalContent.appendChild(modalHeader);

        const modalTitle = document.createElement('h5');
        modalTitle.className = 'modal-title';
        modalTitle.id = `modalLabel-${item._id}`;
        modalTitle.textContent = 'Dettaglio Prodotto';
        modalHeader.appendChild(modalTitle);

        const closeButton = document.createElement('button');
        closeButton.className = 'btn-close';
        closeButton.setAttribute('data-bs-dismiss', 'modal');
        closeButton.setAttribute('aria-label', 'Close');
        modalHeader.appendChild(closeButton);

        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        modalContent.appendChild(modalBody);

        const infoModalBody = document.createElement(`span`)
        infoModalBody.className = `modal-descr`;
        infoModalBody.textContent = item.description; // Inserisco qui la descrizione dell'item
        modalBody.appendChild(infoModalBody)

        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';
        modalContent.appendChild(modalFooter);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn btn-secondary';
        closeBtn.setAttribute('data-bs-dismiss', 'modal');
        closeBtn.textContent = 'Chiudi';
        modalFooter.appendChild(closeBtn);
        // fine della struttura del modale

        const brand = document.createElement('p');
        brand.textContent = "Brand: " + item.brand;
        itemInfo.appendChild(brand);

        const price = document.createElement('p');
        price.textContent = "Prezzo: € " + item.price;
        itemInfo.appendChild(price);


        // Aggiungo il bottone di modifica
        const editButton = document.createElement('button'); // creo il bottone nell'html all'interno di "itemCard", assegnandolo alla variabile EditButton
        editButton.textContent = 'Modifica'; // il testo visualizzato sul bottone
        editButton.className = 'btn edit-btn'; // assegno le classi al bottone
        editButton.setAttribute('data-bs-toggle', 'modal'); // Imposto l'attributo data-bs-toggle sul bottone per abilitare il controllo del modal Bootstrap.
        editButton.setAttribute('data-bs-target', '#editModal'); // Imposto data-bs-target per indicare l'id del modal che deve essere attivato quando si clicca il bottone.
        editButton.onclick = function() { // Aggiungo un gestore evento onclick al bottone che chiama la funzione fillModal, passando le info dell'item corrente.
          fillModal(item);
        };
        itemButtons.appendChild(editButton); // Aggiungo il bottone di modifica al div itemCard.

        // creo il bottone di eliminazione
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Elimina'; 
        deleteButton.className = 'btn delete-btn'; // assegno le classi al bottone
        deleteButton.onclick = function() { 
            deleteItem(item._id); // prendo come riferimento l'id dell'item selezionato
        };
        itemButtons.appendChild(deleteButton); // Aggiungo il bottone Elimina al div itemCard.
        
        // creo la logica che consente al pulsante search di "aprirsi" quando lo si clicka
          const search = document.querySelector(".search-wrapper");
          const input = search.querySelector("input");
          
          search.addEventListener("click", () => {
            if (!input.matches(":focus")) {
              search.classList.add("activesrc");
            }
          });
          
          const srcInput = document.querySelector("input[type='search']");
          
          srcInput.addEventListener("input", () => {
              const searchText = srcInput.value.toLowerCase(); // Ottiene il testo di ricerca e lo converte in minuscolo
              if (searchText.length >= 2) { //comincia a filtrare dopo le prime 3 lettere inserite nell'input
                  const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchText));
                  displayItems(filteredItems); // Visualizza solo i prodotti filtrati
              } else if (searchText.length === 0) {
                  displayItems(allItems); // Visualizza tutti i prodotti se il campo di ricerca è vuoto
              }
          });
          
          search.addEventListener("mouseleave", () => {
            if (!input.matches(":focus") && !input.value.trim()) {
              search.classList.remove("activesrc");
            }
          });

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
      fetchItems(); // Aggiorno la lista degli elementi
  });

  
  

  
  fetchItems(); // Carico gli elementi esistenti all'avvio
});


