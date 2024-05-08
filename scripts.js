const url = "https://striveschool-api.herokuapp.com/api/product/"; // URL dell'endpoint remoto che fornisce la lista degli elementi
const itemContainer = document.getElementById(`items-container`)


// Funzione asincrona per recuperare gli elementi dall'endpoint remoto
async function fetchItems() {
    // Recupera la risposta dall'endpoint remoto
    const response = await fetch(url,{ 
    headers: {
    // Invio il token di autorizzazione per poter gestire l'API 
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM5ZmI5M2Q2MzdmMzAwMTVhZGJmNmIiLCJpYXQiOjE3MTUwNzU5ODcsImV4cCI6MTcxNjI4NTU4N30.Mn-ZTbTLpn-SPTEYW7p_M3noajZAlf8qt8QjyaatmCU`
    } });    
    const items = await response.json(); // Converte la risposta in un oggetto JSON
    console.log(items); // Stampa l'elenco degli elementi nella console del browser
    return items; // Restituisce l'elenco degli elementi
  }

  