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
        socket.emit('lookup', input.value.toLowerCase());
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
    let eventsParse = JSON.parse(jsonParse.events);
    
    for (let dataObject of eventsParse) {
        nameCaption.textContent = json.person;
        gradeCaption.textContent = json.grade;
        dobCaption.textContent = json.dob;
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