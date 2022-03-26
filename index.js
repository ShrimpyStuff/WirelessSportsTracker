const { ok } = require('assert');
const express = require('express');
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

/** @type {WeakMap<SocketIO.Socket, Object>} */
const socketIOLocals = new WeakMap();
io.use((socket, next) => {
    const locals = { player: null }; // Create new instance
    socketIOLocals.set(socket, locals);
    next();
});

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
  });
});

server.listen(port, serverIp, () => {
  console.log(`listening on port ${port}`)
})