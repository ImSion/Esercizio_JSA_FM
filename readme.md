Il progetto è stato suddiviso in 3 pagine html, 3 pagine javascript e 1 style condiviso per tutti
le 3 pagine html sono:
index, che viene usata come "vetrina" per visualizzare i prodotti disponibili

backoffice, che è l'area dove tramite un form-input vengono creati i prodotti che vengono poi stampati con la possibilità di essere modificati/eliminati

detail, che è la pagina per visualizzare il prodotto in dettaglio

i 3 script sono:
index.js, che gestisce sostanzialmente la chiamata all'API col metodo GET per poter ottenere i prodotti da "stampare" poi a schermo

backoffice.js, è il cuore dell'app che si occupa di gestire l'intera logica della creazione/modifica/cancellazione dei prodotti, e di conseguenza quindi di popolare/ridimensionare l'endpoint

detail.js per recuperare i dati dall'endpoint (l'id del prodotto) e tramite quello ottenere tutte le informazioni nella pagina di dettaglio apposita

RIFERIMENTI Style: 
2-123 Stile navbar
126-302 stile backoffice
305-    stile home

NOTE: in backoffice, si è scelto di poter visualizzare la descrizione dei prodotti tramite un bottone "descrizione" che apre un modale con tutte le info, in modo da non influenzare il layout della card e mantenere così un design pulito e minimale.
