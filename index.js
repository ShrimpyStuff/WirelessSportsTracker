const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const ioNormal = new Server(server);
const ioAdmin = new Server(server, {path: "/admin_socket.io/"})
const port = 80
const serverIp = '0.0.0.0'

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/site/index.html')
})

app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/public/adminSite/index.html')
})

let db = new sqlite3.Database('./info.db')
let lookupsql = `SELECT Event event,
                FROM 
`;

ioNormal.on('connection', (socket) => {
  socket.lastRequested = '';
  socket.monitoring = false;
  socket.on('lookup', (input) => {
    lastRequested = input;
    let array = [];
    let blankobject = {
      title: '', people: '', time: '', finished: false, placing: ''
    }
    db.each(sql, [lastRequested], (err, row) => {
      if (err) {
        console.log(err);
        return;
      }
      let object = {...blankobject}
      object.title = row.title;
      object.people = row.people;
      object.time = row.time;
      object.finished = row.finished;
      object.placing = row.placing;
      array.push(object)
    });
    socket.emit('infoReturn', JSON.stringify(array))
  });

  socket.on('monitorRequest', () => {
    socket.monitoring = true;
  });
});

ioAdmin.on('connection', (socket) => {
  socket.on('update', (input) => {
    db.each
    input = JSON.parse(input);
    for (let otherSocket of ioNormal.sockets.sockets) {
      let isMonitoring = JSON.parse(JSON.stringify(otherSocket[1], getCircularReplacer())).monitoring;
      let lastRequested = JSON.parse(JSON.stringify(otherSocket[1], getCircularReplacer())).lastRequested;

      if (!isMonitoring) continue;
      if (lastRequested !== input.person) continue;

      otherSocket.emit('infoReturn', JSON.stringify([]));
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