 import { calendarDiv, renderCalendar, calendard, yearNow, selectedMonth, monthNow, createCalendar } from './calendar.js';
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


 let selectedMonthCopy = selectedMonth;
 let pickedDate = undefined;
 const calendarCtrl = {
     initListeners(calendarTable) {

         const daysArray = calendarTable.querySelectorAll('tbody td');
         for (const day of daysArray) {
             day.addEventListener('click', function() {
                 pickedDate = new Date(this.dataset.date);
                 day.classList.add('date-clicked')
                 for (const day2 of daysArray) {
                     if (day2.classList.contains('date-clicked') && day2 !== day) {
                         day2.classList.remove('date-clicked');
                     }
                 }
                 document.querySelector('#date-cal').innerHTML = moment(pickedDate).format('DD.MM.YYYY');

             });
         }


     },
     initListenersMonths() {
         const previous = document.querySelector('#previous');
         const next = document.querySelector('#next');
         selectedMonthCopy <= monthNow ? previous.style.display = 'none' : previous.style.display = 'inline';
         previous.addEventListener('click', function() {
             calendarDiv.innerHTML = '';
             let calendarTable = renderCalendar(createCalendar(yearNow, --selectedMonthCopy));
             calendarCtrl.initListeners(calendarTable);
             calendarCtrl.initListenersMonths();
         });
         next.addEventListener('click', function() {
             calendarDiv.innerHTML = '';
             let calendarTable = renderCalendar(createCalendar(yearNow, ++selectedMonthCopy));
             calendarCtrl.initListeners(calendarTable);
             calendarCtrl.initListenersMonths();
         });
     },
     initCalendar() {

         let calendarTable = renderCalendar(calendard);
         this.initListeners(calendarTable);
         this.initListenersMonths();
     }
 }


 const filmSelector = document.querySelector('#film-select');
 const roomSelector = document.querySelector('#room-select');
 const priceSelector = document.querySelector('#price-select');
 const showingsDiv = document.querySelector('#showings');
 const filmsDiv = document.querySelector('#films');
 const pricesDiv = document.querySelector('#prices');
 calendarCtrl.initCalendar();


 fetch(request(API_URL + "films", 'GET'))
     .then(res => res.json())
     .then(films => {
         console.log(films);


         for (const film of films) {
             const opt = document.createElement("option");
             opt.value = film.id;
             opt.text = `ID: ${film.id} || Title: ${film.title} || Director: ${film.director} || Genre: ${film.genre} || Length: ${film.length}`;
             filmSelector.options.add(opt);
         }


         for (const film of films) {
             const optDiv = document.createElement("div");
             //optDiv.id = film.id;
             const opt = document.createElement("p");
             const span = document.createElement("span");
             span.dataset.id = film.id;
             span.innerHTML = `<i class="fa fa-trash"></i>`;
             opt.innerHTML = `${film.id} || Film : ${film.title}  || Room: ${film.director} || Seats: ${film.genre}  ||  Length: ${film.length} || Category: ${film.category} `;
             optDiv.appendChild(opt);
             optDiv.appendChild(span);
             filmsDiv.appendChild(optDiv);

             span.addEventListener('click', function() {
                 if (confirm("Are you sure you want to delete this film? All the purchased tickets for this showings will be REMOVED!")) {
                     // deleteFilm(this.dataset.id);
                     filmsDiv.removeChild(optDiv);
                 } else {}

             });

         }

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


         for (const price of prices) {
             const optDiv = document.createElement("div");
             const opt = document.createElement("p");
             const span = document.createElement("span");
             span.dataset.id = price.id;
             span.innerHTML = `<i class="fa fa-trash"></i>`;
             opt.innerHTML = `${price.id} || Film : ${price.normal}  || ${price.discount}`;
             optDiv.appendChild(opt);
             optDiv.appendChild(span);
             pricesDiv.appendChild(optDiv);

             span.addEventListener('click', function() {
                 if (confirm("Are you sure you want to delete this film? All the purchased tickets for this showings will be REMOVED!")) {
                     // deletePrice(this.dataset.id);
                     pricesDiv.removeChild(optDiv);
                 } else {}

             });

         }
     });


 const deleteShowing = function(id) {
     const show = { showid: id };
     fetch(request(API_URL + "deleteshowing", 'POST', show))
         .then(res => res.json())
         .then(result => {
             console.log(result);
         });

 }


 const deleteFilm = function(id) {
     const film = { filmid: id };
     fetch(request(API_URL + "deletefilm", 'POST', film))
         .then(res => res.json())
         .then(result => {
             console.log(result);
         });

 }


 const deletePrice = function(id) {
     const price = { priceid: id };
     fetch(request(API_URL + "deleteprice", 'POST', price))
         .then(res => res.json())
         .then(result => {
             console.log(result);
         });

 }






 //SHOWINGS 
 //
 fetch(request(API_URL + "showings", 'GET'))
     .then(res => res.json())
     .then(showings => {

         console.log(showings);
         for (const showing of showings) {
             const optDiv = document.createElement("div");
             //optDiv.id = showing.id;
             const opt = document.createElement("p");
             const span = document.createElement("span");
             span.dataset.id = showing.id;
             span.innerHTML = `<i class="fa fa-trash"></i>`;
             opt.innerHTML = `${showing.id} || Film : ${showing.title}  || Room: ${showing.room} || Seats: ${showing.seats}  ||  Date: ${moment(showing.date).format('DD.MM.YYYY. HH:mm')}`;
             optDiv.appendChild(opt);
             optDiv.appendChild(span);
             showingsDiv.appendChild(optDiv);

             span.addEventListener('click', function() {
                 if (confirm("Are you sure you want to delete this showing? All the purchased tickets for this showings will be REMOVED!")) {
                     deleteShowing(this.dataset.id);
                     showingsDiv.removeChild(optDiv);
                 } else {}

             });

         }


         //console.log(filmSelector.options);
     });



 const showingCreate = document.querySelector('#showing-create');

 showingCreate.addEventListener('submit', function(e) {
     e.preventDefault();
     const time = document.querySelector('#appt-time');
     const momentTime = moment(time.value, 'HH:mm');
     const hour = momentTime.hour();
     const minute = momentTime.minute();
     const dateFixed = moment(pickedDate).set({ 'hour': hour, 'minute': minute });
     console.log(dateFixed);
     const showing = {
         film: filmSelector.value,
         price: priceSelector.value,
         room: roomSelector.value,
         date: dateFixed
     };
     // console.log(`${filmSelector.value} ${priceSelector.value} ${roomSelector.value}`);
     fetch(request(`${API_URL}newshowing`, 'POST', showing))
         .then(res => res.json())
         .then(result => {
             console.log(JSON.stringify(result));
         }).catch(error => Promise.reject(new Error(error)));
 });