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

io.on('connection', (socket) => {
  socket.lastRequested = '';
  socket.monitoring = false;
  //socket.emit('infoReturn', "[{\n  \"title\": \"hello\",\n  \"people\": \"Ok, Ok, Ok, Ok\",\n  \"time\": \"gold\",\n  \"finished\": false,\n  \"placing\": \"1st\"\n}]")
  socket.on('lookup', (input) => {
    lastRequested = input;
    console.log(input)
    let object = {
      title: '', people: '', time: '', finished: '', placing: ''
    }
    socket.emit('infoReturn', JSON.stringify([object]))
  });

  socket.on('monitorRequest', () => {
    socket.monitoring = true;
    socket.lastRequested = lastRequested;
  });
});

server.listen(port, serverIp, () => {
  console.log(`listening on port ${port}`)
})