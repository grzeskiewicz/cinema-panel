import { refreshShowings } from './showings.js';
import { refreshFilms } from './films.js';
import getPrices from './prices.js';
import getCustomers from './customers.js';
import getRooms from './rooms.js';
import { calendarCtrl } from './calendarCtrl.js';

const filmsContainer = document.querySelector('#films-container');
const pricesContainer = document.querySelector('#prices-container');
const showingsContainer = document.querySelector('#showings-container');
const customersContainer = document.querySelector('#customers-container');

function resetContainers() {
    filmsContainer.style.display = 'none';
    pricesContainer.style.display = 'none';
    showingsContainer.style.display = 'none';
    customersContainer.style.display = 'none';
}

//APP INIT
let selectedMenu = 1;

refreshShowings();

refreshFilms();

getPrices();

getCustomers();

getRooms();

calendarCtrl.initCalendar();

resetContainers();


//MENU CONTROL

const menuNav = document.querySelector('#menu');
const menuList = menuNav.querySelectorAll('li');

for (const menu of menuList) {
    menu.addEventListener('click', function () {
        selectedMenu = menu.getAttribute('order');
        for (const menu2 of menuList) {
            menu2.classList.remove('active');
        }
        if (selectedMenu == menu.getAttribute('order')) menu.classList.add('active');
        resetContainers();
        if (selectedMenu == 1) filmsContainer.style.display = 'flex';
        if (selectedMenu == 2) pricesContainer.style.display = 'flex';
        if (selectedMenu == 3) showingsContainer.style.display = 'flex';
        if (selectedMenu == 4) customersContainer.style.display = 'flex';
    });
}


export function validateForm(obj) {
    for (const [key, value] of Object.entries(obj)) {
        console.log(value);
        if (String(value).trim() === '' || String(value) === undefined || String(value) === null) return false;
    }
    return true;
}