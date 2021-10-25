const express = require('express');
const cors    = require('cors');
const db      = require('../db/connection');

/** Associate models */
require('./index');

class Server {
  constructor() {
    this.app  = express();
    this.port = process.env.PORT || 8080;

    this.paths = {
      auth          : '/api/auth',
      user          : '/api/users',
      profile       : '/api/profiles',
      employee      : '/api/employees',
      sale          : '/api/sales',
      branch_company: '/api/branches-company',
      water_commission_config  : '/api/water-commission-config',
      icebar_commission_config : '/api/icebar-commission-config',
      icecube_commission_config: '/api/icecube-commission-config',
    };

    /** DB connection  */
    this.dbConnection();

    this.middlewares();

    /** API Rest routes */
    this.routes();
  }

  async dbConnection() {
    try {
      await db.authenticate();
      console.log('DB online');
    } catch ( error ) {
      throw new Error( error );
    }
  }

  middlewares() {
    /** CORS */
    this.app.use( cors() );

    /** Read and parse body */
    this.app.use( express.json() );
  }

  routes() {
    this.app.use( this.paths.auth,           require('../routes/auth') );
    this.app.use( this.paths.user,           require('../routes/users') );
    this.app.use( this.paths.profile,        require('../routes/profiles') );
    this.app.use( this.paths.employee,       require('../routes/employees') );
    this.app.use( this.paths.sale,           require('../routes/sales') );
    this.app.use( this.paths.branch_company, require('../routes/branches-company') );
    this.app.use( this.paths.water_commission_config,   require('../routes/water-commission-config') );
    this.app.use( this.paths.icebar_commission_config,  require('../routes/icebar-commission-config') );
    this.app.use( this.paths.icecube_commission_config, require('../routes/icecube-commission-config') );
  }

  listen() {
    this.app.listen( this.port, () => {
      console.log('Sever running on PORT: ', this.port);
    }); 
  }
}

module.exports = Server;