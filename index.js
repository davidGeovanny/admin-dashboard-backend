const path = require('path'); 
const Server = require('./models/server');

require('dotenv').config({ path: path.join( __dirname, '.env' ) });

const server = new Server();

server.listen();