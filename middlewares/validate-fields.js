const { request } = require('express');
const { Op } = require('sequelize');
const Employee = require('../models/employee');
const Profile = require('../models/profile');
const User = require('../models/user');

const checkEmailAvailable = async ( email = '' ) => {
  
  const employees = await Employee.findAll({
    where: {
      email: {
        [ Op.eq ] : email
      },
    }
  });

  if( employees.length > 0 ) {
    throw new Error('Email is already in use');
  }
}

const checkUserAvailable = async ( username = '' ) => {
  const users = await User.findAll({
    where: {
      username: {
        [ Op.eq ] : username
      },
    }
  });

  if( users.length > 0 ) {
    throw new Error('The username is already in use');
  }
}

const checkProfileAvailable = async ( profile = '' ) => {

  if( profile.toLowerCase() === 'administrador' || profile.toLowerCase() === 'superadmin' ) {
    throw new Error('Profile name is not valid');
  }

  const profiles = await Profile.findAll({
    where: {
      profile: {
        [ Op.eq ] : profile
      },
    }
  });

  if( profiles.length > 0 ) {
    throw new Error('Profile name is already in use');
  }
}

const checkEmployeeExists = async ( id_employee = '' ) => {

  if( !Number( id_employee ) ) {
    throw new Error('The employee selected not exist');
  }

  const employee = await Employee.findAll({
    where: {
      id: {
        [ Op.eq ] : id_employee
      }
    }
  });

  if( employee.length <= 0 ) {
    throw new Error('The employee selected not exist');
  }
}

const checkPasswordsMatch = ( password_confirmation = '', { req = request } ) => {
  const { password } = req.body;
  
  if( password_confirmation !== password ) {
    throw new Error('The passwords not match');
  }
  
  return true;
}

module.exports = {
  checkEmailAvailable,
  checkUserAvailable,
  checkProfileAvailable,
  checkPasswordsMatch,
  checkEmployeeExists,
};