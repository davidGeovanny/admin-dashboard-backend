const { request } = require('express');
const { Op }      = require('sequelize');
// const { BranchCompany } = require('../models');

const Employee = require('../models/Employee_t');
const Profile  = require('../models/Profile_t');
const User     = require('../models/User');
const BranchCompany = require('../models/BranchCompany');

const checkEmailAvailable = async ( email = '', { req = request } ) => {
  const { id = '' } = req.params;

  const employees = await Employee.findAll({
    where: {
      [ Op.and ] :  [
        {
          email: {
            [ Op.eq ] : email
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

  if( employees.length > 0 ) {
    throw new Error('El correo electrónico ya está siendo utilizado');
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
    throw new Error('El nombre de usuario ya está siendo utilizado');
  }
}

const checkProfileAvailable = async ( profile = '', { req = request } ) => {
  const { id = '' } = req.params;

  if( profile.toLowerCase() === 'administrador' || profile.toLowerCase() === 'superadmin' ) {
    throw new Error('El nombre del perfil no es válido');
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
    throw new Error('El nombre del perfil ya está siendo utilizado');
  }
}

const checkEmployeeExists = async ( id_employee = '' ) => {
  if( !Number( id_employee ) ) {
    throw new Error('El empleado seleccionado no existe');
  }

  const employee = await Employee.findAll({
    where: {
      id: {
        [ Op.eq ] : id_employee
      }
    }
  });

  if( employee.length <= 0 ) {
    throw new Error('El empleado seleccionado no existe');
  }
}

const checkPasswordsMatch = ( password_confirmation = '', { req = request } ) => {
  const { password } = req.body;
  
  if( password_confirmation !== password ) {
    throw new Error('Las contraseñas no coinciden');
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
    throw new Error('El nombre de la sucursal ya está siendo utilizado');
  }
}

const checkBranchCompanyExists = async ( id_branch_company = '' ) => {
  if( !Number( id_branch_company ) ) {
    throw new Error('La sucursal seleccionada no existe');
  }

  const branch_company = await BranchCompany.findByPk( id_branch_company );

  if( !branch_company ) {
    throw new Error('La sucursal seleccionada no existe');
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