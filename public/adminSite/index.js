let socket = io({
    path: "/admin_socket.io/"
});
let table = document.getElementById('table');
let nameCaption = document.getElementById('nameText');
let gradeCaption = document.getElementById('gradeText');
let form = document.getElementById('form');
let dobCaption = document.getElementById('dobText');

document.getElementById('Lookup').addEventListener('click', (e) => {
    socket.emit('lookup', nameCaption.value.trim());
});

let removeRow = (row) => {
    table.deleteRow(row-1);
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (nameCaption.value.trim().toLowerCase().match(/^(edit this|events||)$/)) {
        let eventJson = [];
        for (let row of table.rows) {
            let rowObject = {title: '', time: '', finished: false, placing: ''};
            rowObject.title = row.children[0].innerText;
            rowObject.time = row.children[1].innerText;
            if (rowObject.title == '' || rowObject.time == '') {
                continue;
            }
            rowObject.placing = row.children[2].innerText;
            if (rowObject.placing && rowObject.placing != undefined && rowObject.placing != '') {
                rowObject.finished = true;
            }
            eventJson.push(rowObject);
        }
        socket.emit('updateEvent', JSON.stringify(eventJson));
    } else {
        let eventJson = [];
        for (let row of table.rows) {
            let rowObject = {title: '', time: '', finished: false, placing: ''};
            rowObject.title = row.children[0].innerText;
            rowObject.time = row.children[1].innerText;
            if (rowObject.title == '' || rowObject.time == '') {
                continue;
            }
            rowObject.placing = row.children[2].innerText;
            if (rowObject.placing && rowObject.placing != undefined && rowObject.placing != '') {
                rowObject.finished = true;
            }
            eventJson.push(rowObject);
        }
        socket.emit('update', nameCaption.value.trim(), JSON.stringify(eventJson));
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
    checkboxButton.addEventListener('click', (e) => {removeRow(checkboxButton.parentNode.parentNode.rowIndex) });
    event.appendChild(checkbox);
    
    table.appendChild(event);
});

socket.on('infoReturn', (json) => {
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    let jsonParse = JSON.parse(JSON.parse(JSON.stringify(json)));
    let eventsParse = JSON.parse(jsonParse.events);
    
    for (let dataObject of eventsParse) {
        nameCaption.value = nameCaption.value.trim();
        gradeCaption.value = jsonParse.grade;
        dobCaption.value = jsonParse.dob;
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
        checkboxButton.addEventListener('click', (e) => { removeRow(checkboxButton.parentNode.parentNode.rowIndex) });
        event.appendChild(checkbox);

        table.appendChild(event);
    }
});
