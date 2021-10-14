const { request } = require('express');
const { Op }      = require('sequelize');
// const { BranchCompany } = require('../models');

const Employee = require('../models/employee');
const Profile  = require('../models/profile');
const User     = require('../models/user');
const BranchCompany = require('../models/branch-company');

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

const checkUserAvailable = async ( username = '', { req = request } ) => {
  const { id = '' } = req.params;

  const users = await User.findAll({
    where: {
      [ Op.and ] :  [
        {
          username: {
            [ Op.eq ] : username
          }
        },
        {
          id: {
            [ Op.ne ] : id
          }
        },
      ]
    }
  });

  if( users.length > 0 ) {
    throw new Error('The username is already in use');
  }
}

const checkProfileAvailable = async ( profile = '', { req = request } ) => {
  const { id = '' } = req.params;

  if( profile.toLowerCase() === 'administrador' || profile.toLowerCase() === 'superadmin' ) {
    throw new Error('Profile name is not valid');
  }

  const profiles = await Profile.findAll({
    where: {
      [ Op.and ] : [
        { 
          profile: { 
            [ Op.eq ] : profile 
          } 
        },
        {
          id: {
            [ Op.ne ] : id
          }
        },
      ]
    }
  });

  if( profiles.length > 0 ) {
    throw new Error('Profile name is already in use');
  }
}

const checkEmployeeExists = async ( id_employee = '' ) => {
  if( !Number( id_employee ) ) {
    throw new Error('The employee selected does not exist');
  }

  const employee = await Employee.findAll({
    where: {
      id: {
        [ Op.eq ] : id_employee
      }
    }
  });

  if( employee.length <= 0 ) {
    throw new Error('The employee selected does not exist');
  }
}

const checkPasswordsMatch = ( password_confirmation = '', { req = request } ) => {
  const { password } = req.body;
  
  if( password_confirmation !== password ) {
    throw new Error('The passwords do not match');
  }
  
  return true;
}

const checkBranchCompanyAvailable = async ( branch = '', { req = request } ) => {
  const { id = '' } = req.params;

  const branchesCompany = await BranchCompany.findAll({
    where: {
      [ Op.and ] : [
        { 
          branch: { 
            [ Op.eq ] : branch 
          } 
        },
        {
          id: {
            [ Op.ne ] : id
          }
        },
      ]
    }
  });

  if( branchesCompany.length > 0 ) {
    throw new Error('Branch name is already in use');
  }
}

const checkBranchCompanyExists = async ( id_branch_company = '' ) => {
  if( !Number( id_branch_company ) ) {
    throw new Error('The branch company selected does not exist');
  }

  const branch_company = await BranchCompany.findByPk( id_branch_company );

  if( !branch_company ) {
    throw new Error('The branch company selected does not exist');
  }
}

module.exports = {
  checkEmailAvailable,
  checkUserAvailable,
  checkProfileAvailable,
  checkPasswordsMatch,
  checkEmployeeExists,
  checkBranchCompanyAvailable,
  checkBranchCompanyExists,
};