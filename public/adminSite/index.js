let socket = io();
let table = document.getElementById('table');
let nameCaption = document.getElementById('nameText');
let gradeCaption = document.getElementById('gradeText');
let form = document.getElementById('form');
let dobCaption = document.getElementById('dobText');

document.getElementById('Lookup').addEventListener('click', (e) => {
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    socket.emit('lookup', nameCaption.textContent.trim());
});

let removeRow = (e, row) => {
    table.deleteRow(row);
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (nameCaption.textContent.trim().toLowerCase().match(/^(edit this|events||)$/)) {
        socket.emit('update', eventJson);
    } else {
        socket.emit('update', nameCaption.textContent.trim())
    }
})

document.getElementById('newEventRow').addEventListener('click', (e) => {
    let event = document.createElement('tr');
    
    let title = document.createElement('th');
    let titleTextNode = document.createTextNode('');
    title.contentEditable = 'true';
    title.appendChild(titleTextNode);
    event.appendChild(title);

    let time = document.createElement('td');
    let timeTextNode = document.createTextNode('');
    time.contentEditable = 'true';
    time.appendChild(timeTextNode);
    event.appendChild(time);

    let placing = document.createElement('td');
    placing.contentEditable = 'true';
    placing.appendChild(document.createTextNode(''));
    
    event.appendChild(placing);
    table.appendChild(event);
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
            placing.appendChild(document.createTextNode('Event not finished or Error'));
        }
        event.appendChild(placing);

        let checkbox = document.createElement('td');
        let checkboxButton = document.createElement('button');
        checkboxButton.type = "checkbox";
        checkboxButton.appendChild(document.createTextNode('Remove row'));
        checkbox.appendChild(checkboxButton);
        checkboxButton.addEventListener('click', (e) => { removeRow(e, event.rowIndex) });
        event.appendChild(checkbox);

        table.appendChild(event);
    }
});
