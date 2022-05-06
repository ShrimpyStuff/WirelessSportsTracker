let socket = io();
let table = document.getElementById('table');
let form = document.getElementById('form');
let input = document.getElementById('fullname');
let monitor = document.getElementById('monitor');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
        socket.emit('lookup', input.value);
        input.value = '';
    }
});

monitor.addEventListener('click', (e) => {
    socket.emit('monitorRequest');
});

socket.on('infoReturn', (json) => {
    console.log(json);
    monitor.disabled = false;
    let jsonParse = JSON.parse(JSON.parse(JSON.stringify(json)));
    if (!Array.isArray(jsonParse)) {
        jsonParse = [];
        jsonParse.push(JSON.parse(JSON.stringify(json)));
    }
    for (let dataObject of jsonParse) {
        document.getElementById('name').textContent = dataObject.person;
        document.getElementById('grade').textContent = dataObject.grade;
        document.getElementById('dob').textContent = dataObject.dob;
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