
import { calendarDiv, renderCalendar, calendard, yearNow, selectedMonth, monthNow, createCalendar } from './calendar.js';
import { showingsList } from './showings.js';
import getRooms from './rooms.js';

let pickedDate = undefined;
let selectedMonthCopy = selectedMonth;
const showingCreate = document.querySelector('#showing-create-form');


const calendarCtrl = {
    initTimetable() {
        const table = [];
        for (let h = 10; h <= 23; h++) { //tablica godziny x sale
            if (!table[h]) table[h] = [];
            for (let m = 0; m <= 55; m = m + 5) {
                table[h][m] = { o: '', times: '' };
            }
        }
        return table;
    },
    scheduledRoomsTableInit(rooms, roomOccupancy) {
        const table = document.getElementById("scheduled-rooms");
        table.innerHTML = ''; //resetting table content on init
        const thead = document.createElement('thead');
        const tbodyMain = document.createElement('tbody');


        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = 'Time';
        th.className = "time-interval";
        tr.appendChild(th);

        for (const room of rooms) {
            const th2 = document.createElement('th');
            th2.textContent = 'Room ' + room.id;
            th2.className = "room";
            tr.appendChild(th2);
        }
        thead.appendChild(tr);

        for (let h = 10; h <= 23; h++) { //tablica godziny x sale

            for (let m = 0; m <= 45; m = m + 15) {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.className = "time-interval";

                (m === 0 || m === 30) ? td.textContent = `${h}:${m === 0 ? '0' + m : m}` : td.textContent = '';
                tr.appendChild(td);
                for (const room of rooms) {
                    const tdroom = document.createElement('td');
                    tdroom.className = "room";
                    if (roomOccupancy[room.id][h][m].o === '') {
                        tdroom.className = tdroom.className + " free";
                    }
                    if (roomOccupancy[room.id][h][m].o === 'X') {
                        if ((h===roomOccupancy[room.id][h][m].times.hStart) && (m===roomOccupancy[room.id][h][m].times.mStart)) console.log("START")
                        tdroom.className = tdroom.className + " occupied";
                        tdroom.addEventListener('mousemove', (e) => {
                            const showing=roomOccupancy[room.id][h][m].showing;
                            tdroom.className = tdroom.className + " tooltip";
                            tdroom.dataset.tooltip = ` ID:${showing.id} Showing:${showing.title} T:${showing.length}`;
                            const tooltip = document.createElement('label');
                            tooltip.classList.add('tooltipBubble');
                            tooltip.innerHTML = tdroom.dataset.tooltip;
                            tdroom.appendChild(tooltip);
                        });
                    }
                    tr.appendChild(tdroom);

                }
                tbodyMain.appendChild(tr);
            }
        }
        table.appendChild(thead);
        table.appendChild(tbodyMain);
    },
    displayHoursCoverage() {
        const x = showingsList.filter(showing => moment(showing.date).format('DD.MM.YYYY') === moment(pickedDate).format('DD.MM.YYYY'));
        console.log(x);
        let table = calendarCtrl.initTimetable();
        const roomOccupancy = [];
        getRooms().then(rooms => {
            for (const room of rooms) {
                for (const showing of x) {
                    if (Number(showing.room) === Number(room.id)) {
                        let hStart = Number(moment(showing.date).format('H'));
                        const mStart = Number(moment(showing.date).format('m'));
                        const finish = Number(moment(showing.date).add(showing.length, 'm')); //when movie finished
                        let hFinish = Number(moment(finish).format('H'));
                        let mFinish = Number(moment(finish).format('m'));
                        if (hStart > hFinish) { hFinish = 23; mFinish = 59; }//?
                        const times = {
                            hStart: hStart,
                            mStart: mStart,
                            hFinish: hFinish,
                            mFinish: mFinish
                        }
                        for (let hour = hStart; hour <= hFinish; hour++) {
                            for (let minute = 0; minute <= 45; minute = minute + 15) {
                                if (hour === hStart && minute >= mStart) table[hour][minute] = { o: 'X', times: times, showing:showing };
                                if (hour === hFinish && minute <= mFinish) table[hour][minute] = { o: 'X', times: times, showing:showing };
                                if (hour !== hStart && hour !== hFinish) table[hour][minute] = { o: 'X', times: '' };
                                // if (hour === hFinish && minute === mFinish) console.log("KONIEC");
                            }
                        }
                    }

                }
                roomOccupancy[room.id] = table;
                table = calendarCtrl.initTimetable();
            }

            calendarCtrl.scheduledRoomsTableInit(rooms, roomOccupancy);
        });
    },


    initListeners(calendarTable) {
        const daysArray = calendarTable.querySelectorAll('tbody td');
        for (const day of daysArray) {
            if (!day.classList.contains('not-selectable')) {
                day.addEventListener('click', function () {
                    showingCreate.querySelector('button').disabled = false;
                    pickedDate = new Date(this.dataset.date);
                    day.classList.add('date-clicked');
                    for (const day2 of daysArray) {
                        if (day2.classList.contains('date-clicked') && day2 !== day) {
                            day2.classList.remove('date-clicked');
                        }
                    }
                    document.querySelector('#date-cal').innerHTML = moment(pickedDate).format('DD.MM.YYYY');
                    calendarCtrl.displayHoursCoverage();
                });
            }

        }


    },
    initListenersMonths() {
        const previous = document.querySelector('#previous');
        const next = document.querySelector('#next');
        selectedMonthCopy <= monthNow ? previous.style.display = 'none' : previous.style.display = 'inline';
        previous.addEventListener('click', function () {
            calendarDiv.innerHTML = '';
            let calendarTable = renderCalendar(createCalendar(yearNow, --selectedMonthCopy));
            calendarCtrl.initListeners(calendarTable);
            calendarCtrl.initListenersMonths();
        });
        next.addEventListener('click', function () {
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


export { calendarCtrl, pickedDate };