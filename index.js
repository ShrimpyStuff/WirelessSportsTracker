const { ok } = require('assert');
const express = require('express');
const { fstat } = require('fs');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 80
const serverIp = '0.0.0.0'

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/site/index.html')
})

app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/public/adminSite/index.html')
})

io.on('connection', (socket) => {
  socket.lastRequested = '';
  socket.monitoring = false;
  socket.on('lookup', (input) => {
    lastRequested = input;
    let object = {
      title: '', people: '', time: '', finished: true, placing: '1st'
    }
    socket.emit('infoReturn', JSON.stringify([object]))
  });

  socket.on('monitorRequest', () => {
    socket.monitoring = true;
    //console.log(socket)
    idk();
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


/*for (let socket of io.sockets.sockets) {
  let isMonitoring = JSON.parse(JSON.stringify(socket[1], getCircularReplacer())).monitoring;
  let lastRequested = JSON.parse(JSON.stringify(socket[1], getCircularReplacer())).lastRequested;
}*/

server.listen(port, serverIp, () => {
  console.log(`listening on port ${port}`)
})