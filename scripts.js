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




 fetch(request(API_URL + "films", 'GET'))
     .then(res => res.json())
     .then(films => {
         console.log(films);
         const filmSelector = document.querySelector('#film-select');

         for (const film of films) {
             const opt = document.createElement("option");
             opt.text = film;
             filmSelector.options.add(opt);
         }


         //console.log(filmSelector.options);
     });


 fetch(request(API_URL + "rooms", 'GET'))
     .then(res => res.json())
     .then(rooms => {
         console.log(rooms);
     });



 fetch(request(API_URL + "prices", 'GET'))
     .then(res => res.json())
     .then(prices => {
         console.log(prices);
     });