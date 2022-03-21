const { ok } = require('assert');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 80

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/site/index.html')
})

app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/public/adminSite/index.html')
})

io.on('connection', (socket) => {
  socket.on('lookup', (input) => {
    console.log(input)
    socket.emit('info', JSON.stringify(data))
  });
});

server.listen(port, '192.168.16.1', () => {
  console.log(`listening on port ${port}`)
})