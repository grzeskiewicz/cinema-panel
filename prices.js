import { API_URL, request } from './apiConnection.js';
import { validateForm } from './scripts.js';

const pricesTable = document.querySelector('#prices');
const priceSelector = document.querySelector('#price-select');
const priceCreate = document.querySelector('#price-create');



const deletePrice = function (id) {
    const price = { priceid: id };
    fetch(request(API_URL + "deleteprice", 'POST', price))
        .then(res => res.json())
        .then(result => {
            alert("Price set deleted");
        });
}

function editPrice(price) {
    if (!validateForm(price)) {
        alert("No empty values in form please!");
        return;
    }
    return fetch(request(API_URL + "editprice", 'POST', price))
        .then(res => res.json())
        .then(result => {
            console.log(result);
        });
}

function getPrices() {
    pricesTable.querySelector('tbody').innerHTML = "";
    fetch(request(API_URL + "prices", 'GET'))
        .then(res => res.json())
        .then(prices => {
            for (const price of prices) {
                const option = document.createElement("option");
                option.value = price.id;
                option.text = `${price.id} Normal: ${price.normal} Discount: ${price.discount}`;
                priceSelector.options.add(option);
            }


            for (const price of prices) {
                const description = document.createElement("tr");
                const modifyIcon = document.createElement("td");
                modifyIcon.dataset.id = price.id;
                modifyIcon.innerHTML = `<i class="fa fa-edit"></i>`;
//                modifyIcon.classList.add('modify');

                const deleteIcon = document.createElement('td');
                deleteIcon.innerHTML = `<i class="fa fa-trash"></i>`;

                description.innerHTML = `<td>${price.id}</td><td>${price.normal}</td><td>${price.discount}</td>`;
                description.appendChild(modifyIcon);
                description.appendChild(deleteIcon);

                pricesTable.querySelector('tbody').appendChild(description);

                deleteIcon.addEventListener('click', function () { //DELETE PRICE
                    if (confirm("Are you sure you want to delete this film? All the purchased tickets for this showings will be REMOVED!")) {
                        deletePrice(modifyIcon.dataset.id);
                        pricesTable.querySelector('tbody').removeChild(description);
                    } else { }

                });
                modifyIcon.addEventListener('click', function () {
                    const priceEditWrapper = document.querySelector('#price-edit-wrapper');
                    priceEditWrapper.innerHTML = '';
                    const priceEditForm = priceCreate.cloneNode(true);
                    priceEditForm.id = "price-edit";
                    priceEditForm['normal-price'].value = price.normal;
                    priceEditForm['discount-price'].value = price.discount;
                    priceEditWrapper.appendChild(priceEditForm);

                    priceEditForm.addEventListener('submit', function (e) {
                        e.preventDefault();
                        const priceSet = { id: price.id, normal: priceEditForm['normal-price'].value, discount: priceEditForm['discount-price'].value };
                        editPrice(priceSet);
                    });
                });
            }
        });
}


//NEW PRICE


priceCreate.addEventListener('submit', function (e) {
    e.preventDefault();
    priceCreate.querySelector('button').disabled = true;
    const price = {
        normal: priceCreate['normal-price'].value,
        discount: priceCreate['discount-price'].value
    };

    if (!validateForm(price)) {
        alert("No empty values in form please!");
        return;
    }

    fetch(request(`${API_URL}newprice`, 'POST', price))
        .then(res => res.json())
        .then(result => {
            document.querySelector('#price-status').innerHTML = "Price created";
            setTimeout(function () {
                priceCreate.querySelector('button').disabled = false;
                priceCreate.reset();
                getPrices();
            }, 3000);
        }).catch(error => Promise.reject(new Error(error)));
});


export default getPrices;