let readyPlayerCount = 0;

function listen(io){
  const pongNamespace = io.of('/pong');
  pongNamespace.on('connection', (socket) => {
    let room;
    console.log("Connected as ", socket.id);

    socket.on('ready', () => {
      room = 'room' + Math.floor(readyPlayerCount / 2);
      socket.join(room);

      console.log('Player ready', socket.id);

      readyPlayerCount++;

      console.log('readyPlayerCount', readyPlayerCount);

      if (readyPlayerCount % 2 === 0){
        pongNamespace.in(room).emit('startGame', socket.id);
      }  
    });

    socket.on('paddleMove', (paddleData) => {
      pongNamespace.to(room).emit('paddleMove', paddleData);
    });

    socket.on('ballMove', (ballData) => {
      pongNamespace.to(room).emit('ballMove', ballData);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected', socket.id, reason);
      socket.leave(room);
    });
  });
}

module.exports = {
  listen
};