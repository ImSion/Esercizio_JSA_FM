const url = "https://striveschool-api.herokuapp.com/api/product/";
const itemsContainer = document.getElementById('list-items');
const tokenAPI = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM5ZmI5M2Q2MzdmMzAwMTVhZGJmNmIiLCJpYXQiOjE3MTUwNzU5ODcsImV4cCI6MTcxNjI4NTU4N30.Mn-ZTbTLpn-SPTEYW7p_M3noajZAlf8qt8QjyaatmCU`;

document.addEventListener("DOMContentLoaded", function() {
    async function fetchItems() {
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${tokenAPI}` }
        });    
        const items = await response.json();
        displayItems(items);  // richiamo alla funzione displayItems
    }

    function displayItems(items) {
        itemsContainer.innerHTML = ''; 
        items.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'products-card col';

        // creo i 3 div che conterranno gli elementi per poter ottimizzare l'UI e facilitarmi la costruzione del layout della card
        const itemTitle = document.createElement(`div`)
        itemTitle.className = `product-title`
        itemCard.appendChild(itemTitle)
        
        const itemInfo = document.createElement(`div`)
        itemInfo.className = `product-info`
        itemCard.appendChild(itemInfo)

        const itemButtons = document.createElement(`div`)
        itemButtons.className = `product-btns`
        itemCard.appendChild(itemButtons)

        // creo gli elementi che popoleranno la card
        const image = document.createElement('img');
        image.src = item.imageUrl;
        image.alt = item.name;
        image.className = "itemimg"
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

            // Aggiungi ulteriori bottoni e modali come necessario qui

            itemsContainer.appendChild(itemCard);
        });
    }

    fetchItems(); // Richiama fetchItems per avviare il processo
});