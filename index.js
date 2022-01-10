require('dotenv').config();
const Server = require('./models/Server_t');

const server = new Server();

server.listen();