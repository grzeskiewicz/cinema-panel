import { API_URL, request } from './apiConnection.js';
import { validateForm } from './scripts.js';
const roomABC = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];



const ticketsTable = document.querySelector('#tickets');
const customersTable = document.querySelector('#customers');

function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

const deleteCustomer = function (id) {
    const customer = { customerid: id };
    fetch(request(API_URL + "deletecustomer", 'POST', customer))
        .then(res => res.json())
        .then(result => {
            alert("Customer deleted");
        });

}

function getCustomers() {
    customersTable.querySelector('tbody').innerHTML = "";
    fetch(request(API_URL + "customers", 'GET'))
        .then(res => res.json())
        .then(customers => {
            const editCustomerForm = document.querySelector('#edit-customer');
            for (const customer of customers) {
                const description = document.createElement("tr");

                const modifyIcon = document.createElement("td");
                modifyIcon.dataset.id = customer.id;
                modifyIcon.innerHTML = `<i class="fa fa-edit"></i>`;
                //  modifyIcon.classList.add('modify');

                const deleteIcon = document.createElement('td');
                deleteIcon.innerHTML = `<i class="fa fa-trash"></i>`

                description.innerHTML = `<td>${customer.id}</td><td>${customer.email}</td><td>${customer.name}</td><td>${customer.surname}</td><td>${customer.telephone}</td>`;
                description.appendChild(modifyIcon);
                description.appendChild(deleteIcon);
                customersTable.querySelector('tbody').appendChild(description);

                description.addEventListener('click', function () {
                    getTicketsByCustomer(modifyIcon.dataset.id);
                });

                deleteIcon.addEventListener('click', function () {
                    if (confirm("Are you sure you want to delete this customer?")) {
                        deleteCustomer(modifyIcon.dataset.id);
                        customersTable.querySelector('tbody').removeChild(description);
                        editCustomerForm.reset();
                    } else { }

                });
                modifyIcon.querySelector('.fa-edit').addEventListener('click', function () {
                    editCustomerForm.style.display = "flex";
                    editCustomerForm.email.value = customer.email;
                    editCustomerForm.name.value = customer.name;
                    editCustomerForm.surname.value = customer.surname;
                    editCustomerForm.telephone.value = customer.telephone;


                    editCustomerForm.addEventListener('submit', function (e) {
                        e.preventDefault();
                        const editCustomer = {
                            id: customer.id,
                            email: editCustomerForm.email.value,
                            name: editCustomerForm.name.value,
                            surname: editCustomerForm.surname.value,
                            telephone: editCustomerForm.telephone.value,
                        };
                        if (!validateForm(editCustomer)) {
                            alert("No empty values in form please!");
                            return;
                        }

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


function getTicketsByCustomer(id) {

    ticketsTable.querySelector('tbody').innerHTML = "";
    const customer = { customerid: id };
    fetch(request(API_URL + "ticketsbycustomer", 'POST', customer))
        .then(res => res.json())
        .then(tickets => {

            for (const ticket of tickets) {
                const description = document.createElement("tr");
                //const modifyIcon = document.createElement("td");
                const deleteIcon = document.createElement("td");
                deleteIcon.dataset.id = ticket.id;
                deleteIcon.innerHTML = `<i class="fa fa-trash"></i>`;
                description.innerHTML = `<td>${ticket.title}</td><td>${moment(ticket.date).format('DD.MM.YYYY HH:mm')}</td><td>${roomABC[ticket.room]}</td><td>${ticket.seat}</td><td>${ticket.price}</td><td>${ticket.email}</td>`;
                ticketsTable.querySelector('tbody').appendChild(description);

                deleteIcon.addEventListener('click', function () {
                    if (confirm("Are you sure you want to delete the ticket?")) {
                        deleteTicket(deleteIcon.dataset.id);
                        ticketsTable.querySelector('tbody').removeChild(descriptionDiv);
                    } else { }
                });
                /*  modifyIcon.querySelector('.fa-edit').addEventListener('click', function () {
                      //funkcja
                  });*/
            }
        });

}


const deleteTicket = function (id) {
    const ticket = { ticketid: id };
    fetch(request(API_URL + "deleteticket", 'POST', ticket))
        .then(res => res.json())
        .then(result => {
            console.log(result);
        });

}


export default getCustomers