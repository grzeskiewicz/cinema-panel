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

 function insertAfter(el, referenceNode) {
     referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
 }


 function sortShowings(showingsList) {
     showingsList = showingsList.sort((a, b) => {
         return moment(a.date) - moment(b.date);
     });
 }

 let selectedMonthCopy = selectedMonth;
 let pickedDate = undefined;
 const calendarCtrl = {
     initListeners(calendarTable) {

         const daysArray = calendarTable.querySelectorAll('tbody td');
         for (const day of daysArray) {
             //  console.log(day.classList);
             if (!day.classList.contains('not-selectable')) {
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
 let showingsList;


 //SHOWINGS  

 fetch(request(API_URL + "showings", 'GET'))
     .then(res => res.json())
     .then(showings => {
         showingsList = showings;
         const groupArr = [];
         //console.log(showings);
         const showingsListed = document.createElement('div');
         showingsListed.id = "showings-listed";
         for (const showing of showings) {
             if (groupArr[showing['title']] === undefined) groupArr[showing['title']] = [];
             groupArr[showing['title']].push(showing);

             /*)) const optDiv = document.createElement("div");
              //optDiv.id = showing.id;
              const opt = document.createElement("p");
              const modifyDiv = document.createElement("div");
              modifyDiv.dataset.id = showing.id;
              modifyDiv.innerHTML = `<i class="fa fa-trash"></i><i class="fa fa-edit"></i>`;
              modifyDiv.classList.add('modify');
              opt.innerHTML = `${showing.id} || Film : ${showing.title}  || Room: ${showing.room} || Seats: ${showing.seats}  ||  Date: ${moment(showing.date).format('DD.MM.YYYY. HH:mm')}`;
              optDiv.appendChild(opt);
              optDiv.appendChild(modifyDiv);
              showingsDiv.appendChild(optDiv);
              modifyDiv.querySelector('.fa-trash').addEventListener('click', function() {
                  if (confirm("Are you sure you want to delete this showing? All the purchased tickets for this showings will be REMOVED!")) {
                      console.log(modifyDiv.dataset);
                      deleteShowing(modifyDiv.dataset.id);
                      showingsDiv.removeChild(optDiv);
                  } else {}

              });
              modifyDiv.querySelector('.fa-edit').addEventListener('click', function() {
                  //funkcja
              });*/
         }


         const groupedShowingsArray = [];
         for (let film in groupArr) {
             const filmTitles = document.createElement('div');
             filmTitles.classList.add('film-titles');
             const title = document.createElement('p');
             title.innerHTML = `${film}`;
             filmTitles.appendChild(title);
             showingsDiv.appendChild(filmTitles);


             filmTitles.addEventListener('click', function() {
                 showingsListed.innerHTML = "";
                 const result = sortShowings(groupArr[film]);
                 console.log(result);
                 for (const showing of groupArr[film]) {
                     console.log(moment(showing.date), showing.date);
                     const descriptionDiv = document.createElement("div");
                     const description = document.createElement("p");
                     const modifyDiv = document.createElement("div");
                     modifyDiv.innerHTML = `<i class="fa fa-trash"></i><i class="fa fa-edit"></i>`;
                     modifyDiv.classList.add('modify');
                     modifyDiv.dataset.id = showing.id;
                     description.innerHTML = `${showing.id} || Film : ${showing.title}  || Room: ${showing.room} || Seats: ${showing.seats}  ||  Date: ${moment(showing.date).format('DD.MM.YYYY. HH:mm')}`;
                     descriptionDiv.appendChild(description);
                     descriptionDiv.appendChild(modifyDiv);
                     showingsListed.appendChild(descriptionDiv);

                     modifyDiv.querySelector('.fa-trash').addEventListener('click', function() {
                         if (confirm("Are you sure you want to delete this showing? All the purchased tickets for this showings will be REMOVED!")) {
                             console.log(modifyDiv.dataset);
                             deleteShowing(modifyDiv.dataset.id);
                             showingsListed.removeChild(descriptionDiv);
                         } else {}

                     });
                     modifyDiv.querySelector('.fa-edit').addEventListener('click', function() {
                         //funkcja
                     });
                 }

                 insertAfter(showingsListed, filmTitles);
             });
             // groupedShowingsArray.push(groupArr[key]);
         }
         // console.log(groupedShowingsArray);
     });


 //FILMS

 fetch(request(API_URL + "films", 'GET'))
     .then(res => res.json())
     .then(films => {
         const filmEditForm = filmCreate.cloneNode(true);
         filmEditForm.id = "film-edit";
         filmEditForm.querySelector('button').textContent = "Edit film";
         for (const film of films) {
             const option = document.createElement("option");
             option.value = film.id;
             option.text = `ID: ${film.id} || Title: ${film.title} || Director: ${film.director} || Genre: ${film.genre} || Length: ${film.length}`;
             filmSelector.options.add(option);
         }


         for (const film of films) {
             const descriptionDiv = document.createElement("div");
             const description = document.createElement("p");
             const modifyDiv = document.createElement("div");
             modifyDiv.dataset.id = film.id;
             modifyDiv.innerHTML = `<i class="fa fa-trash"></i><i class="fa fa-edit"></i>`;
             modifyDiv.classList.add('modify');
             description.innerHTML = `${film.id} || Film : ${film.title}  || Room: ${film.director} || Genre: ${film.genre}  ||  Length: ${film.length} || Category: ${film.category} `;
             descriptionDiv.appendChild(description);
             descriptionDiv.appendChild(modifyDiv);
             filmsDiv.appendChild(descriptionDiv);

             modifyDiv.querySelector('.fa-trash').addEventListener('click', function() {
                 if (confirm("Are you sure you want to delete this film? All the purchased tickets for this showings will be REMOVED!")) {
                     deleteFilm(modifyDiv.dataset.id);
                     filmsDiv.removeChild(descriptionDiv);
                 } else {}

             });

             modifyDiv.querySelector('.fa-edit').addEventListener('click', function() {
                 filmEditForm.title.value = film.title;
                 filmEditForm.director.value = film.director;
                 filmEditForm.genre.value = film.genre;
                 filmEditForm.length.value = film.length;
                 filmEditForm.category.value = film.category;
                 insertAfter(filmEditForm, descriptionDiv);
             });

         }

     });



 //ROOMS

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


 //PRICES

 fetch(request(API_URL + "prices", 'GET'))
     .then(res => res.json())
     .then(prices => {
         console.log(prices);


         for (const price of prices) {
             const option = document.createElement("option");
             option.value = price.id;
             option.text = `${price.id} Normal: ${price.normal} Discount: ${price.discount}`;
             priceSelector.options.add(option);
         }


         for (const price of prices) {
             const descriptionDiv = document.createElement("div");
             const description = document.createElement("p");
             const modifyDiv = document.createElement("div");
             modifyDiv.dataset.id = price.id;
             modifyDiv.innerHTML = `<i class="fa fa-trash"></i><i class="fa fa-edit"></i>`;
             modifyDiv.classList.add('modify');
             description.innerHTML = `${price.id} || Price normal : ${price.normal}  || Price discount: ${price.discount}`;
             descriptionDiv.appendChild(description);
             descriptionDiv.appendChild(modifyDiv);
             pricesDiv.appendChild(descriptionDiv);

             modifyDiv.querySelector('.fa-trash').addEventListener('click', function() {
                 if (confirm("Are you sure you want to delete this film? All the purchased tickets for this showings will be REMOVED!")) {
                     // deletePrice(this.dataset.id);
                     pricesDiv.removeChild(descriptionDiv);
                 } else {}

             });
             modifyDiv.querySelector('.fa-edit').addEventListener('click', function() {
                 //funkcja
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




 const showingCreate = document.querySelector('#showing-create');






 showingCreate.addEventListener('submit', function(e) {
     e.preventDefault();
     const time = document.querySelector('#appt-time');
     const momentTime = moment(time.value, 'HH:mm');
     const hour = momentTime.hour();
     const minute = momentTime.minute();
     const dateFixed = moment(pickedDate).set({ 'hour': hour, 'minute': minute });
     showingCreate.querySelector('button').disabled = true;
     const showing = {
         film: filmSelector.value,
         price: priceSelector.value,
         room: roomSelector.value,
         date: dateFixed
     };
     if (validateShowings()) {
     // console.log(`${filmSelector.value} ${priceSelector.value} ${roomSelector.value}`);
     fetch(request(`${API_URL}newshowing`, 'POST', showing))
         .then(res => res.json())
         .then(result => {
             console.log(JSON.stringify(result));
             document.querySelector('#showing-status').innerHTML = "Showing created";
             setTimeout(function() {
                 showingCreate.querySelector('button').disabled = false;
                 showingCreate.reset();
             }, 3000);
         }).catch(error => Promise.reject(new Error(error)));
     } else {
        alert("NO KURWA NIE");
        showingCreate.querySelector('button').disabled = false;
     }
 },false);



 //showingCreate.addEventListener('submit', validateShowings, false);

 function validateShowings() {
     const time = document.querySelector('#appt-time');
     const momentTime = moment(time.value, 'HH:mm');
     const hour = momentTime.hour();
     const minute = momentTime.minute();
     const dateFixed = moment(pickedDate).set({ 'hour': hour, 'minute': minute });

     for (const showing of showingsList) {

         if (moment(showing.date).format('DD.MM.YYYY') === moment(pickedDate).format('DD.MM.YYYY') && showing.room === roomSelector.value) {
             if (Math.abs(Number(moment(showing.date).hour() * 60 + moment(showing.date).minute()) - Number(dateFixed.hour() * 60 + dateFixed.minute())) < showing.length + 15) {
return false;
         }
         // console.log(moment(showing.date).hour(), moment(showing.date).minute() , dateFixed.hour(), dateFixed.minute() );
     }
 }
 return true;
 }

 const filmCreate = document.querySelector('#film-create');

 filmCreate.addEventListener('submit', function(e) {
     e.preventDefault();

     filmCreate.querySelector('button').disabled = true;
     const film = {
         title: filmCreate.title.value,
         director: filmCreate.director.value,
         genre: filmCreate.genre.value,
         length: filmCreate.length.value,
         category: filmCreate.category.value,
         imageurl: filmCreate.imageurl.value
     };
     // console.log(`${filmSelector.value} ${priceSelector.value} ${roomSelector.value}`);
     fetch(request(`${API_URL}newfilm`, 'POST', film))
         .then(res => res.json())
         .then(result => {
             console.log(JSON.stringify(result));
             document.querySelector('#film-status').innerHTML = "Film created";
             setTimeout(function() {
                 filmCreate.querySelector('button').disabled = false;
                 filmCreate.reset();
             }, 3000);
         }).catch(error => Promise.reject(new Error(error)));
 });