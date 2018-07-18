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
let pickedDate=undefined;
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
document.querySelector('#date-cal').innerHTML= moment(pickedDate).format('DD.MM.YYYY');

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
 const showingsDiv=document.querySelector('#showings');
 calendarCtrl.initCalendar();
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



 fetch(request(API_URL + "showings", 'GET'))
     .then(res => res.json())
     .then(showings => {

console.log(showings);
         for (const showing of showings) {
             const opt = document.createElement("p");
             opt.innerHTML=`${showing.id} || Film : ${showing.title}  || Room: ${showing.room} || Seats: ${showing.seats}  ||  Date: ${moment(showing.date).format('DD.MM.YYYY. HH:mm')}`;
            // opt.value = film.id;
             //opt.text = `ID: ${film.id} || Film: ${film.title} || Director: ${film.director} || Genre: ${film.genre} || Length: ${film.length}`;
             showingsDiv.appendChild(opt);
         }


         //console.log(filmSelector.options);
     });


 const showingCreate = document.querySelector('#showing-create');

 showingCreate.addEventListener('submit', function(e) {
     e.preventDefault();
     const time=document.querySelector('#appt-time');
     const momentTime=moment(time.value,'HH:mm');
     const hour=momentTime.hour();
     const minute=momentTime.minute();
    const dateFixed= moment(pickedDate).set({'hour': hour, 'minute': minute});
     console.log( dateFixed );
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