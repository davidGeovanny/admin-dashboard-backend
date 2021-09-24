const { request, response } = require('express');
const { Op } = require('sequelize');
const jwt    = require('jsonwebtoken');

const { User } = require('../models');

const validateJWT = async ( req = request, res = response, next ) => {
  const token = req.header('x-token');

  if( !token ) {
    return res.status(401).json({
      ok: false,
      msg: 'Token not valid',
      errors: {
        name: 'ValidationTokenError',
        msg: 'There is no token in the request'
      }
    });
  }

  try {
    const { id } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

    /** Read user token data  */
    const user = await User.scope('tokenScope').findOne({
      where: {
        id: {
          [ Op.eq ] : id
        }
      }
    });

    if( !user ) {
      return res.status(401).json({
        ok: false,
        msg: 'Token not valid',
        errors: {
          name: 'ValidationTokenError',
          msg: 'Token not valid - user does not exist'
        }
      });
    }

    /** Add user data to request */
    req.user = user;

    next();
  } catch ( err ) {
    return res.status(401).json({
      ok: false,
      msg: 'Token not valid',
      errors: err
    });
  }
}

module.exports = {
  validateJWT,
};