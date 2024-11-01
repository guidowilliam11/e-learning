// hocuspocus-server.js
const { Server } = require('@hocuspocus/server');

const server = Server.configure({
  port: 1234,
  async onListen() {
    console.log(`Hocuspocus server is running on ws://localhost:1234`);
  },
});

server.listen();