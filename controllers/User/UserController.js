const { response, request } = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const _      = require('underscore');

const { User, Profile, Employee } = require('../../models');
const UserAttr = require('../../utils/classes/UserAttr');

const { formatSequelizeError } = require('../../helpers/FormatSequelizeError');
const { pagination }           = require('../../helpers/Pagination');
const { filterResultQueries }  = require('../../helpers/Filter');
const { 
  GET_CACHE, 
  SET_CACHE, 
  CLEAR_CACHE, 
  CLEAR_SECTION_CACHE 
} = require('../../helpers/Cache');

const getAllRowsData = async () => {
  try {
    let rows = JSON.parse( GET_CACHE( `${ UserAttr.SECTION }(all)` ) );
  
    if( !rows ) {
      rows = await User.findAll();
      SET_CACHE( `${ UserAttr.SECTION }(all)`, JSON.stringify( rows ), 60000 );
    }
  
    return rows;
  } catch ( err ) {
    return [];
  }
}

const getUsers = async ( req = request, res = response ) => {
  try {
    const queries = req.query;
    
    let rows = await getAllRowsData();

    rows = filterResultQueries( rows, queries, UserAttr.filterable );
    rows = pagination( rows, queries, UserAttr.filterable );
  
    return res.json({
      ok: true,
      ...rows
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

const createUser = async ( req = request, res = response ) => {
  const userBody  = _.pick( req.body, ['username', 'id_employee', 'password'] );
  userBody.status = UserAttr.STATUS[0];
  
  try {
    const user = await User.create( userBody );

    const defaultProfile = await Profile.findOne({
      where: { default: { [ Op.eq ] : 1 } }
    });

    if( defaultProfile ) {
      await user.addProfile( defaultProfile );
      CLEAR_CACHE( `${ UserAttr.SECTION }(all)` );
    }

    return res.json({
      ok:   true,
      data: user,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

const updateUser = async ( req = request, res = response ) => {
  const { id }   = req.params;
  const userBody = _.pick( req.body, ['username', 'id_employee', 'status'] );

  try {
    const user = await User.findByPk( id );

    if( !user ) {
      return res.status(404).json({
        ok: false,
        msg: 'El usuario no existe',
        errors: []
      });
    }

    await user.update( userBody );
    CLEAR_SECTION_CACHE('users');

    return res.json({
      ok:   true,
      data: user,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

const updateUserPassword = async ( req = request, res = response ) => {
  const { id }   = req.params;
  const userBody = _.pick( req.body, ['password', 'current_password'] );

  try {
    const user = await User.scope('loginScope').findByPk( id );

    if( !user ) {
      return res.status(404).json({
        ok:     false,
        msg:    'El usuario no existe',
        errors: []
      });
    }

    const validPassword = bcrypt.compareSync( userBody.current_password, user.password );

    if( !validPassword ) {
      return res.status(400).json({
        ok:     false,
        msg:    'La contraseña actual no coincide con la proporcionada',
        errors: []
      });
    }

    await user.update( userBody );

    return res.json({
      ok:   true,
      data: user,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

const deleteUser = async ( req = request, res = response ) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk( id );

    if( !user ) {
      return res.status(404).json({
        ok:     false,
        msg:    'El usuario no existe',
        errors: []
      });
    }

    await user.destroy();
    CLEAR_SECTION_CACHE('users');

    return res.json({
      ok:   true,
      data: user,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
};