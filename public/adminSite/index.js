let socket = io();
let nameCaption = document.getElementById('nameText');
let gradeCaption = document.getElementById('gradeText');
let dobCaption = document.getElementById('dobText');

document.getElementById("Lookup").addEventListener('click', (e) => {
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    socket.emit('lookup', nameCaption.textContent.trim());
});

socket.on('infoReturn', (json) => {
    let jsonParse = JSON.parse(JSON.parse(JSON.stringify(json)));
    if (!Array.isArray(jsonParse)) {
        jsonParse = [];
        jsonParse.push(JSON.parse(JSON.stringify(json)));
    }
    for (let dataObject of jsonParse) {
        nameCaption.textContent = dataObject.person;
        gradeCaption.textContent = dataObject.grade;
        dobCaption.textContent = dataObject.dob;
        let event = document.createElement('tr');

        let title = document.createElement('th');
        let titleTextNode = document.createTextNode(dataObject.title);
        title.contentEditable = 'true';
        title.appendChild(titleTextNode);
        event.appendChild(title);

        let time = document.createElement('td');
        let timeTextNode = document.createTextNode(dataObject.time);
        time.contentEditable = 'true';
        time.appendChild(timeTextNode);
        event.appendChild(time);

        let placing = document.createElement('td');
        placing.contentEditable = 'true';
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
