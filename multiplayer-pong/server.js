const http = require('http');
const api = require('./api');
const io = require('socket.io');
const server = http.createServer(api);

const socketServer = io(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const sockets = require('./sockets');
const PORT = 3000;

server.listen(PORT);
sockets.listen(socketServer);




