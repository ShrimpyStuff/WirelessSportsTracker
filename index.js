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

    socket.on('insertPerson', (input) => {
        db.run(`INSERT INTO students (Name, Grade, DOB, Events)
        VALUES (?, ?, ?, ?)`, ["sajid monowar", 8, "10/17/2008", `[{"title": "Ok", "time":"2:00 PM"}, {"title": "Ok2", "time":"1:30 PM"}]`], (err) => {
        if (err) {
            return console.log(err.message);
        }
        console.log(`This worked.`);
        });
    });

    socket.on('updateEvent', (eventJson) => {
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
                let hasEvent = false;
                for (let i=0; i< 1; i++) {
                    if (events[i].title) {
                        hasEvent = true; 
                    }
                }

                if (hasEvent) {
                    
                }

                let blankobject = {
                    events: '', person: '', grade: '', dob: ''
                }
                let object = {...blankobject}
                object.events = row.events;
                object.person = row.person;
                object.grade = row.grade;
                object.dob = row.dob;

                otherSocket.emit('infoReturn', JSON.stringify(object));

                //db.run
            });
        }
  });

  socket.on('update', (input) => {
    console.log('ok2');
    //db.run
    input = JSON.parse(input);
    for (let otherSocket of ioNormal.sockets.sockets) {
      let isMonitoring = JSON.parse(JSON.stringify(otherSocket[1], getCircularReplacer())).monitoring;
      let lastRequested = JSON.parse(JSON.stringify(otherSocket[1], getCircularReplacer())).lastRequested;

      if (!isMonitoring) continue;
      if (lastRequested !== input.person) continue;
      
      let blankobject = {
        events: '', person: '', grade: '', dob: ''
      }
      let object = {...blankobject}

      object.events = row.events;
      object.person = row.person;
      object.grade = row.grade;
      object.dob = row.dob;

      otherSocket.emit('infoReturn', JSON.stringify(object));
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
