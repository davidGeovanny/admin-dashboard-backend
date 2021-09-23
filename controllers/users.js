const { response, request } = require('express');
const { Op } = require('sequelize');

const { User, Profile } = require('../models');

const getUsers = async ( req = request, res = response ) => {
  try {
    const users = await User.findAll();
    
    res.json({
      ok: true,
      users
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: err
    });
  }
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

    const defaultProfile = await Profile.findOne({
      where: { default: { [ Op.eq ] : 1 } }
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
      msg: 'An error has ocurred',
      errors: err
    });
  }
}

module.exports = {
  getUsers,
  createUser,
};