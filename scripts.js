 import { calendarDiv, renderCalendar, calendard, yearNow, selectedMonth, monthNow, createCalendar } from './calendar.js';
 const API_URL = 'https://cinema-node.herokuapp.com/';
 const IMAGE_URL = 'https://cinema-node-bucket.s3.amazonaws.com/';
 const headers = new Headers({
     'Accept': 'application/json',
     'Content-Type': 'application/json',
 });

 const headersUp=new Headers({
    'Accept': 'image/*',
    'Content-Type': 'image/*'
 })


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
                     showingCreate.querySelector('button').disabled = false;
                     pickedDate = new Date(this.dataset.date);
                     day.classList.add('date-clicked');
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
     initTimeSelect() {
         const hourSelector = document.querySelector('#hour-select');
         for (let i = 10; i <= 22; i++) {
             const option = document.createElement("option");
             option.value = i;
             option.text = i;
             hourSelector.options.add(option);
         }

         const minuteSelector = document.querySelector('#minute-select');
         for (let i = 0; i <= 55; i = i + 5) {
             const option = document.createElement("option");
             option.value = i;
             if (i == 0) { option.text = '00'; } else if (i == 5) {
                 option.text = '05';
             } else {
                 option.text = i;
             }
             minuteSelector.options.add(option);
         }
     },
     initCalendar() {
         let calendarTable = renderCalendar(calendard);
         this.initListeners(calendarTable);
         this.initListenersMonths();
         this.initTimeSelect();

     }
 }


 const filmSelector = document.querySelector('#film-select');
 const roomSelector = document.querySelector('#room-select');
 const priceSelector = document.querySelector('#price-select');
 const showingsDiv = document.querySelector('#showings');
 const showingsDiv2 = document.querySelector('#showings-2');
 const showingsConstant = document.querySelector('#constant');
 const filmsDiv = document.querySelector('#films');
 const pricesDiv = document.querySelector('#prices');
 const ticketsDiv = document.querySelector('#tickets');
 const customersDiv = document.querySelector('#customers');
 const loader = document.querySelector('.loader');
 calendarCtrl.initCalendar();
 let showingsList;


 //SHOWINGS  
 function getShowings() {

     return fetch(request(API_URL + "showings", 'GET'))
         .then(res => res.json())
         .then(showings => {
             return showings;
         });

 }
 //getShowings().then(res=>{console.log(res)});

 function refreshShowings() {
     showingsDiv2.innerHTML = "";
     loader.hidden = false;
     fetch(request(API_URL + "showings", 'GET')) //CHANGE THIS FUNCTION NOT TO REPEAT THE CODE AFTER CREATING SHOWING
         .then(res => res.json())
         .then(showings => {

             loader.hidden = true;
             showingsList = showings;
             const groupArr = [];
             const showingsListed = document.createElement('div');
             showingsListed.id = "showings-listed";
             const today = moment();

             today.hour(0);
             today.minute(1);
             //console.log(today);
             for (const showing of showings) {
                 if (groupArr[showing['title']] === undefined) groupArr[showing['title']] = [];
                 if (moment(showing.date) > today) groupArr[showing['title']].push(showing);
             }


             const groupedShowingsArray = [];
             for (let film in groupArr) {
                 const filmTitles = document.createElement('div');
                 filmTitles.classList.add('film-titles');
                 const title = document.createElement('p');
                 title.innerHTML = `${film}`;
                 filmTitles.appendChild(title);
                 showingsDiv2.appendChild(filmTitles);


                 filmTitles.addEventListener('click', function() {
                     showingsListed.innerHTML = "";
                     const result = sortShowings(groupArr[film]);
                     // console.log(result);
                     for (const showing of groupArr[film]) {
                         //console.log(moment(showing.date), showing.date);
                         const descriptionDiv = document.createElement("div");
                         const description = document.createElement("p");
                         const modifyDiv = document.createElement("div");
                         modifyDiv.innerHTML = `<i class="fa fa-trash"></i>`;
                         modifyDiv.classList.add('modify');
                         modifyDiv.dataset.id = showing.id;
                         description.innerHTML = `${showing.id} || Film : ${showing.title}  || Room: ${showing.room} || Seats: ${showing.seats}  || Price (normal/discount): ${showing.normal} / ${showing.discount}  ||  Date: ${moment(showing.date).format('DD.MM.YYYY. HH:mm')}`;
                         descriptionDiv.appendChild(description);
                         descriptionDiv.appendChild(modifyDiv);
                         showingsListed.appendChild(descriptionDiv);

                         modifyDiv.querySelector('.fa-trash').addEventListener('click', function() {
                             if (confirm("Are you sure you want to delete this showing? All the purchased tickets for this showings will be REMOVED!")) {
                                 //.log(modifyDiv.dataset);
                                 deleteShowing(modifyDiv.dataset.id);
                                 showingsListed.removeChild(descriptionDiv);
                                 refreshShowings();
                             } else {}

                         });
                     }

                     insertAfter(showingsListed, filmTitles);
                 });
             }
         });
 }
 refreshShowings();
 //FILMS


 function refreshFilms() {
     filmsDiv.innerHTML = "";
     fetch(request(API_URL + "films", 'GET'))
         .then(res => res.json())
         .then(films => {
             const filmEditForm = filmCreate.cloneNode(true);
             filmEditForm.id = "film-edit";
             filmEditForm.querySelector('button').textContent = "Edit film";
             filmEditForm.upload.remove();
             filmSelector.innerHTML="";
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
                 description.innerHTML = `${film.id} || Title : ${film.title}  || Director: ${film.director} || Genre: ${film.genre}  ||  Length: ${film.length} || Category: ${film.category} `;
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

                     filmEditForm.addEventListener('submit', function(e) {
                         e.preventDefault();
                         const filmEdit = {
                             id: film.id,
                             title: filmEditForm.title.value,
                             director: filmEditForm.director.value,
                             genre: filmEditForm.genre.value,
                             length: filmEditForm.length.value,
                             category: filmEditForm.category.value,
                         };
                         // console.log(filmEdit);
                         fetch(request(API_URL + "editfilm", 'POST', filmEdit))
                             .then(res => res.json())
                             .then(result => {
                                 //console.log(result);
                             });
                     });
                 });

             }

         });

 }

 refreshFilms();

 //ROOMS

 fetch(request(API_URL + "rooms", 'GET'))
     .then(res => res.json())
     .then(rooms => {
         //console.log(rooms);


         for (const room of rooms) {
             const opt = document.createElement("option");
             opt.value = room.id;
             opt.text = `${room.id} Seats: ${room.seats}`;
             roomSelector.options.add(opt);
         }
     });


 //PRICES
 function getPrices() {
     pricesDiv.innerHTML = "";
     fetch(request(API_URL + "prices", 'GET'))
         .then(res => res.json())
         .then(prices => {
             // console.log(prices);


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

                 modifyDiv.querySelector('.fa-trash').addEventListener('click', function() { //DELETE PRICE
                     if (confirm("Are you sure you want to delete this film? All the purchased tickets for this showings will be REMOVED!")) {
                         deletePrice(modifyDiv.dataset.id);
                         pricesDiv.removeChild(descriptionDiv);
                     } else {}

                 });
                 modifyDiv.querySelector('.fa-edit').addEventListener('click', function() {
                     //funkcja
                 });
             }
         });

 }

 getPrices();
 //TICKETS
 function getTicketsByCustomer(id) {
     const customer = { customerid: id };
     fetch(request(API_URL + "ticketsbycustomer", 'POST', customer))
         .then(res => res.json())
         .then(tickets => {
             // console.log(tickets);
             ticketsDiv.innerHTML = "";

             for (const ticket of tickets) {
                 const descriptionDiv = document.createElement("div");
                 const description = document.createElement("p");
                 const modifyDiv = document.createElement("div");
                 modifyDiv.dataset.id = ticket.id;
                 modifyDiv.innerHTML = `<i class="fa fa-trash"></i><i class="fa fa-edit"></i>`;
                 modifyDiv.classList.add('modify');
                 description.innerHTML = `${ticket.id} || Film : ${ticket.title}  || Date: ${moment(ticket.date).format('DD.MM.YYYY HH:mm')}|| Room: ${ticket.room} || Seat: ${ticket.seat} || Price: ${ticket.price}  ||  Customer: ${ticket.email}`;
                 descriptionDiv.appendChild(description);
                 descriptionDiv.appendChild(modifyDiv);
                 ticketsDiv.appendChild(descriptionDiv);

                 modifyDiv.querySelector('.fa-trash').addEventListener('click', function() {
                     if (confirm("Are you sure you want to delete the ticket?")) {
                         //console.log(modifyDiv.dataset);
                         deleteTicket(modifyDiv.dataset.id);
                         ticketsDiv.removeChild(descriptionDiv);
                     } else {}

                 });
                 modifyDiv.querySelector('.fa-edit').addEventListener('click', function() {
                     //funkcja
                 });
             }
         });

 }


 function getCustomers() {
     customersDiv.innerHTML = "";
     fetch(request(API_URL + "customers", 'GET'))
         .then(res => res.json())
         .then(customers => {
             //console.log(customers);
             const editCustomerForm = document.querySelector('#edit-customer');
             for (const customer of customers) {
                 const descriptionDiv = document.createElement("div");
                 const description = document.createElement("p");
                 const modifyDiv = document.createElement("div");
                 modifyDiv.dataset.id = customer.id;
                 modifyDiv.innerHTML = `<i class="fa fa-trash"></i><i class="fa fa-edit"></i>`;
                 modifyDiv.classList.add('modify');
                 description.innerHTML = `${customer.id} || E-mail : ${customer.email}   || Name : ${customer.name}  || Surename :  ${customer.surename} || Telephone : ${customer.telephone}   || `;
                 descriptionDiv.appendChild(description);
                 descriptionDiv.appendChild(modifyDiv);
                 customersDiv.appendChild(descriptionDiv);
                 descriptionDiv.addEventListener('click', function() {
                     getTicketsByCustomer(modifyDiv.dataset.id);
                 });

                 modifyDiv.querySelector('.fa-trash').addEventListener('click', function() {
                     if (confirm("Are you sure you want to delete this customer?")) {
                         //console.log(modifyDiv.dataset);
                         deleteCustomer(modifyDiv.dataset.id);
                         customersDiv.removeChild(descriptionDiv);
                         editCustomerForm.reset();
                     } else {}

                 });
                 modifyDiv.querySelector('.fa-edit').addEventListener('click', function() {
                     // console.log(customer);
                     editCustomerForm.style.display = "flex";

                     editCustomerForm.email.value = customer.email;
                     editCustomerForm.name.value = customer.name;
                     editCustomerForm.surename.value = customer.surename;
                     editCustomerForm.telephone.value = customer.telephone;
                     insertAfter(editCustomerForm, descriptionDiv);


                     editCustomerForm.addEventListener('submit', function(e) {
                         e.preventDefault();
                         const editCustomer = {
                             id: customer.id,
                             email: editCustomerForm.email.value,
                             name: editCustomerForm.name.value,
                             surename: editCustomerForm.surename.value,
                             telephone: editCustomerForm.telephone.value,

                         };
                         // console.log(editCustomer);
                         // console.log(editCustomerForm);
                         fetch(request(API_URL + "editcustomer", 'POST', editCustomer))
                             .then(res => res.json())
                             .then(result => {
                                 getCustomers();
                             });
                     });
                 });



             }
         });

 }
 getCustomers();


 const deleteShowing = function(id) {
     const show = { showid: id };
     fetch(request(API_URL + "deleteshowing", 'POST', show))
         .then(res => res.json())
         .then(result => {
             // console.log(result);
         });

 }


 const deleteFilm = function(id) {
     const film = { filmid: id };
     fetch(request(API_URL + "deletefilm", 'POST', film))
         .then(res => res.json())
         .then(result => {
             //console.log(result);
         });

 }


 const deletePrice = function(id) {
     const price = { priceid: id };
     fetch(request(API_URL + "deleteprice", 'POST', price))
         .then(res => res.json())
         .then(result => {
             //console.log(result);
         });

 }


 const deleteTicket = function(id) {
     const ticket = { ticketid: id };
     // console.log(id);
     fetch(request(API_URL + "deleteticket", 'POST', ticket))
         .then(res => res.json())
         .then(result => {
             console.log(result);
         });

 }


 const deleteCustomer = function(id) {
     const customer = { customerid: id };
     // console.log(id);
     fetch(request(API_URL + "deletecustomer", 'POST', customer))
         .then(res => res.json())
         .then(result => {
             //console.log(result);
         });

 }




 const showingCreate = document.querySelector('#showing-create');






 showingCreate.addEventListener('submit', function(e) {
     e.preventDefault();
     //const time = document.querySelector('#appt-time');
     //const momentTime = moment(time.value, 'HH:mm');
     // const hour = momentTime.hour();
     // const minute = momentTime.minute();
     const hour = document.querySelector('#hour-select').value;
     const minute = document.querySelector('#minute-select').value;
     const dateFixed = moment(pickedDate).set({ 'hour': hour, 'minute': minute });
     // console.log(dateFixed);
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
                     refreshShowings();
                 }, 3000);
             }).catch(error => Promise.reject(new Error(error)));
     } else {
         alert("2 showings can't be in one room until first one is still on! Choose different time of showing.");
         showingCreate.querySelector('button').disabled = false;
     }
 }, false);



 function validateShowings() {
     const hour = document.querySelector('#hour-select').value;
     const minute = document.querySelector('#minute-select').value;
     const dateFixed = moment(pickedDate).set({ 'hour': hour, 'minute': minute });

     for (const showing of showingsList) {

         if (moment(showing.date).format('DD.MM.YYYY') === moment(pickedDate).format('DD.MM.YYYY') && showing.room === roomSelector.value) {
             const timeDifference = Math.abs(Number(moment(showing.date).hour() * 60 + moment(showing.date).minute()) - Number(dateFixed.hour() * 60 + dateFixed.minute()));
             if (timeDifference < showing.length) {
                 return false;
             }
             // console.log(moment(showing.date).hour(), moment(showing.date).minute() , dateFixed.hour(), dateFixed.minute() );
         }
     }
     return true;
 }

function uploadFile(file, signedRequest, url) {
  const options = {
    method: 'PUT',
    body: file
  };
  return fetch(signedRequest, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return url;
    });
}


 function getSignedRequest(file) {
     fetch(request(`${API_URL}sign-s3?file-name=${file.name}&file-type=${file.type}`, 'GET'))
         .then(res => res.json())
         .then(response => {
             console.log(response);
             uploadFile(file, response.signedRequest, response.url);
         }).catch(error => console.error(error));
 }


 const filmCreate = document.querySelector('#film-create');

 filmCreate.addEventListener('submit', function(e) {
     e.preventDefault();
     const files = document.getElementById('file-input').files;
     const file = files[0];
     getSignedRequest(file);
     filmCreate.querySelector('button').disabled = true;
     const film = {
         title: filmCreate.title.value,
         director: filmCreate.director.value,
         genre: filmCreate.genre.value,
         length: filmCreate.length.value,
         category: filmCreate.category.value,
         imageurl: IMAGE_URL + file.name
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
                 refreshFilms();
             }, 3000);
         }).catch(error => Promise.reject(new Error(error)));
 });




 const priceCreate = document.querySelector('#price-create');

 priceCreate.addEventListener('submit', function(e) {
     e.preventDefault();
     priceCreate.querySelector('button').disabled = true;
     const price = {
         normal: priceCreate['normal-price'].value,
         discount: priceCreate['discount-price'].value
     };

     fetch(request(`${API_URL}newprice`, 'POST', price))
         .then(res => res.json())
         .then(result => {
             //console.log(JSON.stringify(result));
             document.querySelector('#price-status').innerHTML = "Price created";
             setTimeout(function() {
                 priceCreate.querySelector('button').disabled = false;
                 priceCreate.reset();
                 getPrices();
             }, 3000);
         }).catch(error => Promise.reject(new Error(error)));
 });