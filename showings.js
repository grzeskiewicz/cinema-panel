import { API_URL, request } from './apiConnection.js'
import { pickedDate, calendarCtrl } from './calendarCtrl.js';

const romanNum = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];


const showingsDiv2 = document.querySelector('#showings-2');
const roomSelector = document.querySelector('#room-select');
const showingCreate = document.querySelector('#showing-create-form');
const filmSelector = document.querySelector('#film-select');
const priceSelector = document.querySelector('#price-select');
const loader = document.querySelector('.loader');

let showingsList;



function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}


function sortShowings(showingsList) {
    showingsList = showingsList.sort((a, b) => {
        return moment(a.date) - moment(b.date);
    });
}
/*function getShowings() {
    return fetch(request(API_URL + "showings", 'GET'))
        .then(res => res.json())
        .then(showings => {
            return showings;
        });

}*/
const deleteShowing = function (id) {
    const show = { showid: id };
    fetch(request(API_URL + "deleteshowing", 'POST', show))
        .then(res => res.json())
        .then(result => {
            // console.log(result);
        });

}

function refreshShowings() {
    showingsDiv2.innerHTML = "";
    loader.hidden = false;
    return fetch(request(API_URL + "showings", 'GET')) //CHANGE THIS FUNCTION NOT TO REPEAT THE CODE AFTER CREATING SHOWING
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


                filmTitles.addEventListener('click', function () {
                    showingsListed.innerHTML = "";
                    const result = sortShowings(groupArr[film]);
                    for (const showing of groupArr[film]) {
                        const descriptionDiv = document.createElement("div");
                        const description = document.createElement("p");
                        const modifyDiv = document.createElement("div");
                        modifyDiv.innerHTML = `<i class="fa fa-trash"></i>`;
                        modifyDiv.classList.add('modify');
                        modifyDiv.dataset.id = showing.id;
                        description.innerHTML = `${showing.id} || Film : ${showing.title}  || Room: ${romanNum[showing.room]} || Seats: ${showing.seats}  || Price (normal/discount): ${showing.normal} / ${showing.discount}  ||  Date: ${moment(showing.date).format('DD.MM.YYYY. HH:mm')}`;
                        descriptionDiv.appendChild(description);
                        descriptionDiv.appendChild(modifyDiv);
                        showingsListed.appendChild(descriptionDiv);

                        modifyDiv.querySelector('.fa-trash').addEventListener('click', function () {
                            if (confirm("Are you sure you want to delete this showing? All the purchased tickets for this showings will be REMOVED!")) {
                                deleteShowing(modifyDiv.dataset.id);
                                showingsListed.removeChild(descriptionDiv);
                                refreshShowings();
                            } else { }

                        });
                    }

                    insertAfter(showingsListed, filmTitles);
                });
            }
        });
}


function validateShowings() {
    const hour = document.querySelector('#hour-select').value;
    const minute = document.querySelector('#minute-select').value;
    const dateFixed = moment(pickedDate).set({ 'hour': hour, 'minute': minute });
    for (const showing of showingsList) {
        if (moment(showing.date).format('DD.MM.YYYY') === moment(pickedDate).format('DD.MM.YYYY') && showing.room == roomSelector.value) { // ?
            const timeDifference = Math.abs(Number(moment(showing.date).hour() * 60 + moment(showing.date).minute()) - Number(dateFixed.hour() * 60 + dateFixed.minute()));
            if (timeDifference < showing.length) {
                return false;
            }
        }
    }
    return true;
}


showingCreate.addEventListener('submit', function (e) {
    e.preventDefault();
    const hour = document.querySelector('#hour-select').value;
    const minute = document.querySelector('#minute-select').value;
    const dateFixed = moment(pickedDate).set({ 'hour': hour, 'minute': minute }).format('YYYY-MM-DD HH:mm');
    showingCreate.querySelector('button').disabled = true;
    const showing = {
        film: filmSelector.value,
        price: priceSelector.value,
        room: roomSelector.value,
        date: dateFixed
    };
    if (validateShowings()) {
        fetch(request(`${API_URL}newshowing`, 'POST', showing))
            .then(res => res.json())
            .then(result => {
                // document.querySelector('#showing-status').innerHTML = "Showing created";
                alert("Showing created");
                setTimeout(function () {
                    showingCreate.querySelector('button').disabled = false;
                    showingCreate.reset();
                    refreshShowings().then(res => {
                        console.log(res);
                        calendarCtrl.displayHoursCoverage();
                    })
                }, 1000);
            }).catch(error => Promise.reject(new Error(error)));
    } else {
        alert("2 showings can't be in one room until first one is still on! Choose different time of showing.");
        showingCreate.querySelector('button').disabled = false;
    }
}, false);


export { refreshShowings, validateShowings, showingsList };