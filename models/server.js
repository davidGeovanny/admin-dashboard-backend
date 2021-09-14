const express = require('express');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: '/api/auth',
    };

    /** TODO: DB connection  */

    this.middlewares();

    /** API Rest routes */
    this.routes();
  }

  async dbConnection() {
    /** TODO: DB connection */
  }

  middlewares() {
    /** Read and parse body */
    this.app.use( express.json() );
  }

  routes() {
    // this.app.use( this.paths.auth, );
  }

  listen() {
    this.app.listen( this.port, () => {
      console.log('Sever running on PORT: ', this.port);
    }); 
  }
}

module.exports = Server;