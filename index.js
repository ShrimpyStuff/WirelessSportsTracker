const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 80

app.use(express.static(__dirname + '/public'));

app.get('*', (req, res, next) => {
  if (req.hostname == "admin.ranks.local") {
    res.sendFile(__dirname + '/adminSite/index.html')
  }
  else if (req.ip == "192.168.16.1") {
    res.redirect(`${req.ip}:3000`)
  }
  else if (req.hostname == "status") {
    res.redirect(`${req.hostname}:3000`)
  }
  next()
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/site/index.html')
})

io.on('connection', (socket) => {
  socket.on('lookup', (input) => {
    console.log(input)
    socket.emit('info', JSON.stringify(data))
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`)
})