let socket = io();
let table = document.getElementById('table');
let form = document.getElementById('form');
let input = document.getElementById('fullname');
let monitor = document.getElementById('monitor');
let nameCaption = document.getElementById('name');
let gradeCaption = document.getElementById('grade');
let dobCaption = document.getElementById('dob');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('lookup', input.value.toLowerCase());
    }
});

monitor.addEventListener('click', (e) => {
    socket.emit('monitorRequest');
});

socket.on('infoReturn', (json) => {
    monitor.disabled = false;
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    let jsonParse = JSON.parse(JSON.parse(JSON.stringify(json)));
    let eventsParse = JSON.parse(jsonParse.events);
    
    for (let dataObject of eventsParse) {
        nameCaption.innerText = input.value.trim();
        gradeCaption.innerText = jsonParse.grade;
        dobCaption.innerText = jsonParse.dob;
        let event = document.createElement('tr');

        let title = document.createElement('th');
        title.appendChild(document.createTextNode(dataObject.title));
        event.appendChild(title);

        let time = document.createElement('td');
        time.appendChild(document.createTextNode(dataObject.time));
        event.appendChild(time);

        let placing = document.createElement('td');
        if (dataObject.finished == true) {
            placing.appendChild(document.createTextNode(dataObject.placing));
        }
        else {
            placing.appendChild(document.createTextNode("Event not finished or Error"));
        }
        event.appendChild(placing);
        table.appendChild(event);
    }
});