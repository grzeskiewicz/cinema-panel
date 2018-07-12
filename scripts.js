 const API_URL = 'https://cinema-node.herokuapp.com/';

 const headers = new Headers({
     'Accept': 'application/json',
     'Content-Type': 'application/json',
 });


 function request(url, method, dataset, headerz) {
     return new Request(url, {
         method: method,
         headers: headers,
         mode: 'cors',
         body: JSON.stringify(dataset)
     });
 }


 const filmSelector = document.querySelector('#film-select');
 const roomSelector = document.querySelector('#room-select');
 const priceSelector = document.querySelector('#price-select');

 fetch(request(API_URL + "films", 'GET'))
     .then(res => res.json())
     .then(films => {
         console.log(films);


         for (const film of films) {
             const opt = document.createElement("option");
             opt.value = film.id;
             opt.text = `ID: ${film.id} || Film: ${film.title} || Director: ${film.director} || Genre: ${film.genre} || Length: ${film.length}`;
             filmSelector.options.add(opt);
         }


         //console.log(filmSelector.options);
     });


 fetch(request(API_URL + "rooms", 'GET'))
     .then(res => res.json())
     .then(rooms => {
         console.log(rooms);


         for (const room of rooms) {
             const opt = document.createElement("option");
             opt.value = room.id;
             opt.text = `${room.id} Seats: ${room.seats}`;
             roomSelector.options.add(opt);
         }
     });



 fetch(request(API_URL + "prices", 'GET'))
     .then(res => res.json())
     .then(prices => {
         console.log(prices);


         for (const price of prices) {
             const opt = document.createElement("option");
             opt.value = price.id;
             opt.text = `${price.id} Normal: ${price.normal} Discount: ${price.discount}`;
             priceSelector.options.add(opt);
         }
     });


 const showingCreate = document.querySelector('#showing-create');

 showingCreate.addEventListener('submit', function(e) {
     e.preventDefault();
     console.log(`${filmSelector.value} ${priceSelector.value}`);
 });