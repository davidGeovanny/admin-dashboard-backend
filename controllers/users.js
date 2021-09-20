const { response, request } = require('express');
const { Op } = require('sequelize');
const Profile = require('../models/profile');

const User = require('../models/user');

const getUsers = async ( req = request, res = response ) => {
  const users = await User.findAll({
    include: [
      'employee'
    ],
  });

  res.json({
    ok: true,
    users
  });
}

const createUser = async ( req = request, res = response ) => {
  const { username, password, id_employee } = req.body;

  try {
    const user = new User({ 
      username, 
      status: 'activated', 
      id_employee, 
      password, 
    });
  
    await user.save();

    const defaultProfile = new Profile.findOne({
      where: {
        id: {
          [ Op.eq ] : 5
        }
      }
    });

    if( defaultProfile ) {
      await user.addProfile( defaultProfile )
    }

  
    res.json({
      ok: true,
      user,
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'Ha ocurrido un error',
      errors: err
    });
  }
}

module.exports = {
  getUsers,
  createUser,
};