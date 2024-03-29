'use strict';

const MONTH_NAMES = 'January February March April May June July August September October November December'.split(' ');

export const calendarDiv = document.querySelector('#calendar');
export const weekDiv = document.querySelector('#week');
export let yearNow = new Date().getFullYear();
export const monthNow = new Date().getMonth();
export let selectedMonth = new Date().getMonth();
const today = new Date();


export const calendard = createCalendar(yearNow, selectedMonth);

export function renderCalendar(calendar) {
    const p = document.createElement('p');
    const p2 = document.createElement('p');
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    // iterate weeks
    for (let j = 0; j < calendar.length; j++) {
        // create table row for every week
        const tr = document.createElement('tr');
        const week = calendar[j];
        // iterate days
        for (let k = 0; k < week.length; k++) {
            // create table cell for every day
            const td = document.createElement('td');
            const day = week[k];
            // set day of month as table cell text content
            td.textContent = day.date.getDate();
            td.dataset.date = day.date;
            if (day.date.getMonth() === today.getMonth() && day.date.getDate() === today.getDate()) td.classList.add('today');
            if (day.date < today ) { td.classList.add('not-selectable'); }
            if (td.classList.contains('today')) td.classList.remove('not-selectable');
            // add before/after class
            day.before && td.classList.add('before');
            day.after && td.classList.add('after');

            // mount table cell
            tr.appendChild(td);
        }
        // mount table row
        tbody.appendChild(tr);
    }

    // create month name
    p.innerHTML = `<span id="previous"><<</span>  ${MONTH_NAMES[selectedMonth]} <span id="next"> >> </span>`;
    p.id = "month";
    // create thead
    thead.innerHTML = '<tr><td>' + 'Mo Tu We Th Fr Sa Su'.split(' ').join('</td><td>') + '</td></tr>';

    // mount thead & tbody
    table.appendChild(thead);
    table.appendChild(tbody);

    calendarDiv.innerHTML = '';
    // mount month name to container
    calendarDiv.appendChild(p);
    // mount table to container
    calendarDiv.appendChild(table);
    // p2.textContent = '▼';
    // p2.id="roll";
    // calendarDiv.appendChild(p2);


    return table;
}







export function createCalendar(year, month) {
    const results = [];

    // find out first and last days of the month
    const firstDate = new Date(year, month, 1); //first day of the month
    const lastDate = new Date(year, month + 1, 0); //last day of month
    // calculate first monday and last sunday
    const firstMonday = getFirstMonday(firstDate);
    const lastSunday = getLastSunday(lastDate);

    // iterate days starting from first monday
    let iterator = new Date(firstMonday);
    let i = 0;

    // ..until last sunday
    while (iterator <= lastSunday) {
        if (i++ % 7 === 0) {
            // start new week when monday
            var week = [];
            results.push(week);
        }

        // push day to week
        week.push({
            date: new Date(iterator),
            before: iterator < firstDate, // add indicator if before current month
            after: iterator > lastDate // add indicator if after current month
        });

        // iterate to next day
        iterator.setDate(iterator.getDate() + 1);
    }
    selectedMonth = month;
    return results;
}

function fixMonday(day) {
    day || (day = 7);
    return --day;
}

function getFirstMonday(firstDate) { //first monday closest to 1st day of mondth
    const offset = fixMonday(firstDate.getDay()); //how many days from 1st to monday

    const result = new Date(firstDate);
    result.setDate(firstDate.getDate() - offset); //create first monday : 1st day of the month - offset
    return result;
}

function getLastSunday(lastDate) {
    const offset = 6 - fixMonday(lastDate.getDay()); //how many days till monday (6-dayOfTheWeek -1)

    const result = new Date(lastDate);
    result.setDate(lastDate.getDate() + offset); //last possible sunday after last day of the month

    return result;
}