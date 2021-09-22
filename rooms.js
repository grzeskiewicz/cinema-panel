import { API_URL, request } from './apiConnection.js';
const roomABC = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

const roomSelector = document.querySelector('#room-select');

function resetOptions() {
    for (let i = roomSelector.length - 1; i >= 0; i--) {
        roomSelector.remove(i);
    }
}


function getRooms() {
    return fetch(request(API_URL + "rooms", 'GET'))
        .then(res => res.json())
        .then(rooms => {
            resetOptions();
            for (const room of rooms) {
                const opt = document.createElement("option");
                opt.value = room.id;
                opt.text = `${roomABC[room.id]} Seats: ${room.seats}`;
                roomSelector.options.add(opt);
            }
            return rooms;
        });
}


export default getRooms;