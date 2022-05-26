const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const ioNormal = new Server(server);
const ioAdmin = new Server(server, {path: "/admin_socket.io/"});
const port = 80;
//const serverIp = '192.168.16.1';
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
    let blankobject = {
      events: {}, person: '', grade: '', dob: ''
    }
    db.get(lookupsql, [input.toLowerCase()], (err, row) => {
      if (err) {
        console.log(err);
        return;
      }
      if (row == undefined || !row ) {
        return console.log('Failed', input);
      }
      let object = {...blankobject};
      object.events = JSON.parse(JSON.stringify(row.events));
      object.person = input;
      object.grade = row.grade;
      object.dob = row.dob;
      socket.emit('infoReturn', JSON.stringify(object));
    });
  });

  socket.on('monitorRequest', () => {
    socket.monitoring = true;
  });
});

ioAdmin.on('connection', (socket) => {
    socket.on('lookup', (input) => {
        socket.lastRequested = input;
        let blankobject = {
          events: {}, person: '', grade: '', dob: ''
        }
        db.get(lookupsql, [input.toLowerCase()], (err, row) => {
          if (err) {
            console.log(err);
            return;
          }
          if (row == undefined || !row ) {
            return console.log('Failed', input);
          }
          let object = {...blankobject};
          object.events = JSON.parse(JSON.stringify(row.events));
          object.person = input;
          object.grade = row.grade;
          object.dob = row.dob;
          socket.emit('infoReturn', JSON.stringify(object));
        });
    });

    socket.on('updateEvent', (eventJsonString) => {
      db.each(`SELECT * FROM students`, (err, row) => {
        if (!row.Events || row.Events == undefined) {return;}
        let rowEvents = JSON.parse(row.Events);
        let eventJson = JSON.parse(eventJsonString);
        for (let i=0; i < rowEvents.length; i++) {
          for (let j = 0; j < eventJson.length; j++) {
            if (rowEvents[i].title == eventJson[j].title) {
              let changedEvents = rowEvents;
              changedEvents[i] = eventJson[j];
              rowEvents = changedEvents;
              db.run(`UPDATE students SET events = ? WHERE name = ?`, [JSON.stringify(rowEvents), row.Name]);
            }
          }
        }
      }); 

      for (let otherSocket of ioNormal.sockets.sockets) {
          let isMonitoring = JSON.parse(JSON.stringify(otherSocket[1], getCircularReplacer())).monitoring;
          let lastRequested = JSON.parse(JSON.stringify(otherSocket[1], getCircularReplacer())).lastRequested;

          if (!isMonitoring) continue;
          db.get(lookupsql, [lastRequested.toLowerCase()], (err, row) => {
              if (err) {
                  console.log(err);
                  return;
              }
              if (row == undefined || !row ) {
                  return console.log('Failed', lastRequested.toLowerCase());
              }
              let events = JSON.parse(row.events);
              let eventJson = JSON.parse(eventJsonString);
              for (let i=0; i < events.length - 1; i++) {
                for (let j = 0; j < eventJson.length - 1; j++) {
                  if (events[i].title == eventJson[j].title) {
                    hasEvent(i, changedEvent, otherSocket);
                  }
                }
              }

              function hasEvent(rowNumber, changedEvent, otherSocket) {
                let blankobject = {
                    events: '', person: '', grade: '', dob: ''
                }
                let object = {...blankobject}
                object.events = row.events;
                let changedEvents = JSON.parse(object.events);
                changedEvents[rowNumber] = changedEvent;
                object.events = JSON.stringify(changedEvents);
                object.person = row.person;
                object.grade = row.grade;
                object.dob = row.dob;

                ioNormal.to(JSON.parse(JSON.stringify(otherSocket[1], getCircularReplacer())).id).emit('infoReturn', JSON.stringify(object));
              }
          });
      }
  });

  socket.on('update', (input, eventJson) => {
    db.run(`UPDATE students SET events = ? WHERE name=?`, [eventJson, input.toLowerCase()]);
    for (let otherSocket of ioNormal.sockets.sockets) {
      let isMonitoring = JSON.parse(JSON.stringify(otherSocket[1], getCircularReplacer())).monitoring;
      let lastRequested = JSON.parse(JSON.stringify(otherSocket[1], getCircularReplacer())).lastRequested;

      if (!isMonitoring) continue;
      if (lastRequested != input.toLowerCase()) continue;

      db.get(lookupsql, [lastRequested.toLowerCase()], (err, row) => {
          if (err) {
              console.log(err);
              return;
          }
          if (row == undefined || !row ) {
              return console.log('Failed', lastRequested.toLowerCase());
          }

          let blankobject = {
              events: '', person: '', grade: '', dob: ''
          }
          let object = {...blankobject}
          object.events = eventJson;
          object.person = input;
          object.grade = row.grade;
          object.dob = row.dob;

          ioNormal.to(JSON.parse(JSON.stringify(otherSocket[1], getCircularReplacer())).id).emit('infoReturn', JSON.stringify(object));
      });
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
