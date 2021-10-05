const { request, response } = require('express');
const { Op }  = require('sequelize');
const bcrypt  = require('bcryptjs');
const _       = require('underscore');

const { Employee, User } = require('../models');

const { generateJWT }    = require('../helpers/generate-jwt');
const { formatSequelizeError } = require('../helpers/format-sequelize-error');

const register = async ( req = request, res = response ) => {
  const { 
    name,
    first_lastname,
    second_lastname,
    gender,
    email,
    password = '',
  } = req.body;
  
  try {
    /** Create employee */
    const employee = await Employee.create({ name, first_lastname, second_lastname, gender, email });

    if( employee ) {
      const username = ( first_lastname.substring(0, 2) + second_lastname.substring(0, 2) + name.split(' ')[0] ).toLowerCase();

      const user = await User.create({
        username,
        password,
        status: 'waiting activation',
        id_employee: employee.id
      });

      if( user ) {
        res.status(201).json({
          ok: true,
          user: {
            id      : user.id,
            username: user.username,
          }
        });
      } else {
        res.status(400).json({
          ok: false,
          msg: 'An error has ocurred while creating the user',
          errors: []
        });
      }

    } else {
      res.status(400).json({
        ok: false,
        msg: 'An error has ocurred',
        errors: []
      });
    }
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

const login = async ( req = request, res = response ) => {
  const { username, password } = req.body;

  try {
    const user = await User.scope('loginScope').findOne({
      where: {
        username: {
          [ Op.eq ] : username
        }
      }
    });

    if( !user ) {
      return res.status(404).json({
        ok: false,
        msg: 'Credentials are not correct - username',
        errors: []
      });
    }

    const validPassword = bcrypt.compareSync( password, user.password );

    if( !validPassword ) {
      return res.status(400).json({
        ok: false,
        msg: 'Credentials are not correct - password',
        errors: []
      });
    }

    /** Generate token */
    const token = await generateJWT( user.id );

    res.json({
      ok: true,
      user: {
        id      : user.id,
        username: user.username,
      },
      token,
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

const validateUserToken = async ( req = request, res = response ) => {
  const token = await generateJWT( req.user.id );

  res.json({
    ok: true,
    user: req.user,
    token,
  });
}

module.exports = {
  register,
  login,
  validateUserToken,
};