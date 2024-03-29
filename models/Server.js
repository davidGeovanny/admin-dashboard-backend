const express         = require('express');
const cors            = require('cors');
const rateLimit       = require('express-rate-limit');
const db              = require('../db/Connection');
const { validateJWT } = require('../middlewares/ValidateJWT');

/** Associate models */
// require('./index');

class Server {
  constructor() {
    this.app  = express();
    this.port = process.env.PORT || 8080;

    this.paths = {
      cache         : '/api/cache',
      auth          : '/api/auth',
      user          : '/api/users',
      profile       : '/api/profiles',
      employee      : '/api/employees',
      sale          : '/api/sales',
      branch_company: '/api/branches-company',
      water_commission_config  : '/api/water-commission-config',
      icebar_commission_config : '/api/icebar-commission-config',
      icecube_commission_config: '/api/icecube-commission-config',
      delivery_point_commission_config: '/api/delivery-point-commission-config',
    };

    this.apiLimiter = rateLimit( {
      windowMs: 60 * 1 * 1000, // seconds * minutes * ms in 1 second
      max: 150,
      message: {
        ok:     false,
        msg:    'Se han realizado demasiadas peticiones desde esta dirección IP. Inténtelo de nuevo después de un 1 minuto',
        errors: {}
      }
    });

    /** DB connection  */
    this.dbConnection();

    this.globalMiddlewares();

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

  globalMiddlewares() {
    /** CORS */
    this.app.use( cors() );
    /** Read and parse body */
    this.app.use( express.json() );
    /** Add request limit */
    this.app.use( this.apiLimiter );
  }

  routes() {
    /** Public routes */
    this.app.use( this.paths.auth, require('../routes/Auth') );
    /** Private routes */
    this.app.use( validateJWT );
    this.app.use( this.paths.cache,          require('../routes/Cache') );
    this.app.use( this.paths.user,           require('../routes/Users') );
    this.app.use( this.paths.profile,        require('../routes/Profiles') );
    this.app.use( this.paths.employee,       require('../routes/Employees') );
    this.app.use( this.paths.sale,           require('../routes/Sales') );
    this.app.use( this.paths.branch_company, require('../routes/BranchesCompany') );
    this.app.use( this.paths.water_commission_config,           require('../routes/WaterCommissionConfigs') );
    this.app.use( this.paths.icebar_commission_config,          require('../routes/IcebarCommissionConfigs') );
    this.app.use( this.paths.icecube_commission_config,         require('../routes/IcecubeCommissionConfigs') );
    this.app.use( this.paths.delivery_point_commission_config,  require('../routes/DeliveryPointCommissionConfigs') );
  }

  listen() {
    this.app.listen( this.port, () => {
      console.log('Sever running on PORT: ', this.port);
    }); 
  }
}

module.exports = Server;