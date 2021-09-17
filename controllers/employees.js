const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const getUsers = async ( req = request, res = response ) => {
  const users = await User.findAll();

  res.json({
    users
  });
}

const createUser = async ( req = request, res = response ) => {
  const { name, first_lastname, second_lastname, gender, password } = req.body;

  // Encrypt password
  const salt = bcryptjs.genSaltSync();
  const passEncrypt = bcryptjs.hashSync( password, salt )

  const user = new User({ 
    name, 
    first_lastname, 
    second_lastname, 
    gender, 
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