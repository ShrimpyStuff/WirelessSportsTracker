let socket = io({
    path: "/admin_socket.io/"
  });
let table = document.getElementById('table');
let nameCaption = document.getElementById('nameText');
let gradeCaption = document.getElementById('gradeText');
let form = document.getElementById('form');
let dobCaption = document.getElementById('dobText');

document.getElementById('Lookup').addEventListener('click', (e) => {
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    socket.emit('lookup', nameCaption.value.trim());
});

let removeRow = (row) => {
    table.deleteRow(row);
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (nameCaption.value.trim().toLowerCase().match(/^(edit this|events||)$/)) {
        let eventJson = [];
        for (let row of table.rows) {
            let rowObject = {title: '', time: '', finished: false, placing: ''};
            rowObject.title = row.children[0].textContent;
            rowObject.time = row.children[1].textContent;
            if (rowObject.title == '' || rowObject.time == '') {
                continue;
            }
            rowObject.placing = row.children[2].textContent;
            if (!rowObject.placing || rowObject.placing != undefined) {
                rowObject.finished = true;
            }
            eventJson.push(rowObject);
        }
        console.log(JSON.stringify(eventJson));
        socket.emit('updateEvent', eventJson);
    } else {
        socket.emit('update', nameCaption.value.trim())
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
    
    let checkbox = document.createElement('td');
    let checkboxButton = document.createElement('button');
    checkboxButton.type = "checkbox";
    checkboxButton.appendChild(document.createTextNode('Remove row'));
    checkbox.appendChild(checkboxButton);
    checkboxButton.addEventListener('click', (e) => { removeRow(e, event.rowIndex) });
    event.appendChild(checkbox);
    
    table.appendChild(event);
});

socket.on('infoReturn', (json) => {
    let jsonParse = JSON.parse(JSON.parse(JSON.stringify(json)));
    let eventsParse = JSON.parse(jsonParse.events);
    
    console.log(jsonParse)
    console.log(eventsParse)
    for (let dataObject of eventsParse) {
        nameCaption.textContent = json.person;
        gradeCaption.textContent = json.grade;
        dobCaption.textContent = json.dob;
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
        checkboxButton.addEventListener('click', (e) => { removeRow(event.rowIndex) });
        event.appendChild(checkbox);

        table.appendChild(event);
    }
});
