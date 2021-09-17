const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const getUsers = async ( req = request, res = response ) => {
  const users = await User.findAll({
    include: [
      'employee'
    ],
  });

  res.json({
    users
  });
}

const createUser = async ( req = request, res = response ) => {
  const { username, password, id_employee } = req.body;

  // Encrypt password
  const salt = bcryptjs.genSaltSync();
  const passEncrypt = bcryptjs.hashSync( password, salt )

  const user = new User({ 
    username, 
    status: 'activated', 
    id_employee, 
    password: passEncrypt, 
  });

  await user.save();

  res.json({
    user,
  });
}

module.exports = {
  getUsers,
  createUser,
};