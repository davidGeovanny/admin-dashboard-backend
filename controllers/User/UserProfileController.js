const { response, request } = require('express');
const { Op } = require('sequelize');

const { User, Profile, ProfileUser, Employee } = require('../../models');
const UserAttr = require('../../utils/classes/UserAttr');
const ProfileAttr = require('../../utils/classes/ProfileAttr');

const { GET_CACHE, SET_CACHE } = require('../../helpers/Cache');
const { formatSequelizeError } = require('../../helpers/FormatSequelizeError');

const getUserProfiles = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;
    const key    = `${ UserAttr.SECTION }(${id}).${ ProfileAttr.SECTION }`;

    let row = JSON.parse( GET_CACHE( key ) );

    if( !row ) {
      row = await User.findByPk( id, {
        include: [
          {
            model: Profile.scope( 'activeProfileScope' ),
            as: 'profiles',
            through: {
              attributes: []
            }
          }
        ],
      });
      SET_CACHE( key, JSON.stringify( row ), 60000 );
    }

    if( !row ) {
      return res.status(404).json({
        ok:     false,
        msg:    'El usuario no existe',
        errors: []
      });
    }
  
    return res.json({
      ok: true,
      data: row
    });
  } catch ( err ) {
    console.log( err )
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
        errors: []
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
        errors: []
      });
    }

    await user.addProfile( id_profile );
    CLEAR_CACHE(`${ UserAttr.SECTION }(${ id })`);

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
        errors: []
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
        errors: []
      });
    }

    await profile_user.destroy();
    CLEAR_CACHE(`${ UserAttr.SECTION }(${ id })`);

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
  getUserProfiles,
  userAddProfile,
  userRemoveProfile,
};