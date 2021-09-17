const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const Employee = require('../models/employee');
const User = require('../models/user');

const register = async ( req = request, res = response ) => {
  const { 
    name,
    first_lastname,
    second_lastname,
    gender,
    email,
    password,
  } = req.body;

  // if( !password ) {
  //   return res.status(400).json({
  //     ok: false,
  //     msg: 'Ha ocurrido un error',
  //     errors: {

  //     }
  //   });
  // }
  
  try {
    /** Create employee */
    const employee = new Employee({ name, first_lastname, second_lastname, gender, email });
    await employee.save();

    if( employee ) {
      /** Encrypt password */
      const salt = bcrypt.genSaltSync();
      const passHash = bcrypt.hashSync( password, salt );
      const username = ( first_lastname.substring(0, 2) + second_lastname.substring(0, 2) + name.substring(0, 2) ).toLowerCase();

      const user = new User({
        username,
        password: passHash,
        status: 'waiting activation',
        id_employee: employee.id
      });

      await user.save();

      if( user ) {
        res.json({
          employee,
          user
        });
      } else {
        res.status(400).json({
          ok: false,
          msg: 'Ha ocurrido un error',
          errors: {}
        });
      }

    } else {
      res.status(400).json({
        ok: false,
        msg: 'Ha ocurrido un error',
        errors: {}
      });
    }
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'Ha ocurrido un error',
      errors: err
    });
  }
}

module.exports = {
  register,
};