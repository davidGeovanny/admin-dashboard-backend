const { response, request } = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const _      = require('underscore');

const { User, Profile, ProfileUser } = require('../models');

const { attrUsers }  = require('../data/attr-users');
const { userStatus } = require('../data/static-data');
const { formatSequelizeError } = require('../helpers/format-sequelize-error');
const { pagination }           = require('../helpers/pagination');
const { filterResultQueries }  = require('../helpers/filter');
const { GET_CACHE, SET_CACHE, CLEAR_CACHE } = require('../helpers/cache');

const getAllRowsData = async () => {
  try {
    const { keys } = attrUsers;
    
    let rows = JSON.parse( GET_CACHE( keys.all ) );
  
    if( !rows ) {
      rows = await User.findAll();
      SET_CACHE( keys.all, JSON.stringify( rows ), 60000 );
    }
  
    return rows;
  } catch ( err ) {
    return [];
  }
}

const getUsers = async ( req = request, res = response ) => {
  try {
    const { list } = attrUsers;
    const queries = req.query;
    
    let rows = await getAllRowsData();

    rows = filterResultQueries( rows, queries, list );
    rows = pagination( rows, queries, list );
  
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
  userBody.status = userStatus[0];
  
  try {
    const user = await User.create( userBody );

    const defaultProfile = await Profile.findOne({
      where: { default: { [ Op.eq ] : 1 } }
    });

    if( defaultProfile ) {
      await user.addProfile( defaultProfile );
      CLEAR_CACHE( attrUsers.keys.all );
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
        errors: {}
      });
    }

    await user.update( userBody );
    CLEAR_CACHE( attrUsers.keys.all );

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
        errors: {}
      });
    }

    const validPassword = bcrypt.compareSync( userBody.current_password, user.password );

    if( !validPassword ) {
      return res.status(400).json({
        ok:     false,
        msg:    'La contraseña actual no coincide con la proporcionada',
        errors: {}
      });
    }

    await user.update( userBody );
    CLEAR_CACHE( attrUsers.keys.all );

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

const userAddProfile = async ( req = request, res = response ) => {
  const { id } = req.params;
  const { id_profile } = req.body;

  try {
    const user = await User.findByPk( id );

    if( !user ) {
      return res.status(404).json({
        ok:     false,
        msg:    'El usuario no existe',
        errors: {}
      });
    }

    const profile_user = await ProfileUser.findOne({
      where: {
        [ Op.and ] : [
          {
            id_user: { [ Op.eq ] : id }
          },
          {
            id_profile: { [ Op.eq ] : id_profile }
          },
        ]
      }
    });

    if( profile_user ) {
      return res.json({
        ok:   true,
        data: user
      });
    }
    
    const profile = await Profile.scope('activeProfileScope').findByPk( id_profile );
    
    if( !profile ) {
      return res.status(404).json({
        ok:     false,
        msg:    'No se puede agregar el perfil seleccionado. Verifica si el perfil está activado',
        errors: {}
      });
    }

    await user.addProfile( id_profile );
    CLEAR_CACHE( attrUsers.keys.all );

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

const userRemoveProfile = async ( req = request, res = response ) => {
  const { id } = req.params;
  const { id_profile } = req.body;

  try {
    const user = await User.findByPk( id );

    if( !user ) {
      return res.status(404).json({
        ok:     false,
        msg:    'El usuario no existe',
        errors: {}
      });
    }

    const profile_user = await ProfileUser.findOne({
      where: {
        [ Op.and ] : [
          {
            id_user: { [ Op.eq ] : id }
          },
          {
            id_profile: { [ Op.eq ] : id_profile }
          },
        ]
      }
    });

    if( !profile_user ) {
      return res.status(404).json({
        ok:     false,
        msg:    'El usuario seleccionado no tiene el perfil indicado',
        errors: {}
      });
    }

    await profile_user.destroy();
    CLEAR_CACHE( attrUsers.keys.all );

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
        errors: {}
      });
    }

    await user.destroy();
    CLEAR_CACHE( attrUsers.keys.all );

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
  userAddProfile,
  userRemoveProfile,
};