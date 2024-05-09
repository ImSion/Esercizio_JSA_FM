Il progetto è stato suddiviso in 3 pagine html, 2 pagine javascript e 1 style condiviso per tutti
le 3 pagine html sono:
index, che viene usata come "vetrina" per visualizzare i prodotti disponibili

backoffice, che è l'area dove tramite un form-input vengono creati i prodotti che vengono poi stampati con la possibilità di essere modificati/eliminati

detail, che è la pagina per visualizzare il prodotto in dettaglio

i 2 script sono:
index.js, che gestisce sostanzialmente la chiamata all'API col metodo GET per poter ottenere i prodotti da "stampare" poi a schermo

backoffice.js, è il cuore dell'app che si occupa di gestire l'intera logica della creazione/modifica/cancellazione dei prodotti, e di conseguenza quindi di popolare/ridimensionare l'endpoint

RIFERIMENTI Style: 
2-123 Stile navbar
126-302 stile backoffice
305-    stile home

NOTE: in backoffice, si è scelto di poter visualizzare la descrizione dei prodotti tramite un bottone "descrizione" che apre un modale con tutte le info, in modo da non influenzare il layout della card e mantenere così un design pulito e minimale.


ENG: The project was divided into 3 html pages, 2 javascript pages and 1 style shared for everyone
the 3 html pages are:
index, which is used as a "shop window" to display the available products

backoffice, which is the area where products are created via an input form and then printed with the possibility of being modified/deleted

detail, which is the page to view the product in detail

the 2 scripts are:
index.js, which essentially manages the API call with the GET method in order to obtain the products to then "print" on the screen

backoffice.js, is the heart of the app which manages the entire logic of creating/modifying/deleting products, and consequently populating/resizing the endpoint

NOTE: in the backoffice, we have chosen to be able to view the description of the products via a "description" button which opens a modal with all the info, so as not to influence the layout of the card and thus maintain a clean and minimal design.