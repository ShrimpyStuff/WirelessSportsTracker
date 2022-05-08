const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const ioNormal = new Server(server);
const ioAdmin = new Server(server, {path: "/admin_socket.io/"});
const port = 80;
const serverIp = '0.0.0.0';

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/site/index.html');
});

app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/public/adminSite/index.html');
});

let db = new sqlite3.Database('./info.db');

db.run(`CREATE TABLE IF NOT EXISTS students (Name VARCHAR(100), Grade NUMBER, DOB VARCHAR(100), Events VARCHAR(100), UNIQUE(Name, DOB))`);

let lookupsql = `SELECT Events events,
                        Grade grade,
                        DOB dob
                 FROM students
                 WHERE Name = ?
`;

ioNormal.on('connection', (socket) => {
  socket.lastRequested = '';
  socket.monitoring = false;
  socket.on('lookup', (input) => {
    socket.lastRequested = input;
    let array = [];
    let blankobject = {
      events: {}, person: '', grade: '', dob: ''
    }
    db.get(lookupsql, [input], (err, row) => {
      if (err) {
        console.log(err);
        return;
      }
      if (row == undefined || !row ) {
        return;
      }
      let object = {...blankobject};
      //object.events = JSON.parse(row.events);
      //object.title = rowevent.title;
      object.person = input;
      object.grade = row.grade;
      object.dob = row.dob;
      //object.time = rowevent.time;
      //object.finished = rowevent.finished;
      //object.placing = rowevent.placing;
      array.push(object);
      socket.emit('infoReturn', JSON.stringify(array));
    });
  });

  socket.on('monitorRequest', () => {
    socket.monitoring = true;
  });
});

ioAdmin.on('connection', (socket) => {
  socket.on('insertPerson', (input) => {
    db.run(`INSERT INTO students (Name, Grade, DOB, Events)
    VALUES (?, ?, ?, ?)`, ["Sajid Monowar", 8, "10/17/2008", "ok"], (err) => {
      if (err) {
        return console.log(err.message);
      }
      console.log(`This worked.`);
    });
  });

  socket.on('update', (input) => {
    //db.run
    input = JSON.parse(input);
    for (let otherSocket of ioNormal.sockets.sockets) {
      let isMonitoring = JSON.parse(JSON.stringify(otherSocket[1], getCircularReplacer())).monitoring;
      let lastRequested = JSON.parse(JSON.stringify(otherSocket[1], getCircularReplacer())).lastRequested;

      if (!isMonitoring) continue;
      if (lastRequested !== input.person) continue;
      
      let array = [];
      let blankobject = {
        title: '', person: '', grade: '', dob: '', time: '', finished: false, placing: ''
      }
      let object = {...blankobject}
      object.title = rowevent.title;
      object.person = row.person;
      object.grade = row.grade;
      object.dob = row.dob;
      object.time = rowevent.time;
      object.finished = rowevent.finished;
      object.placing = rowevent.placing;
      array.push(object);

      otherSocket.emit('infoReturn', JSON.stringify(array));
    }
  });
});

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

server.listen(port, serverIp, () => {
  console.log(`listening on port ${port}`)
})
