const { request, response } = require('express');
const { Op } = require('sequelize');
const _      = require('underscore');

const { Profile } = require('../../models');
const ProfileAttr = require('../../utils/classes/ProfileAttr');

const { formatSequelizeError } = require('../../helpers/FormatSequelizeError');
const { pagination }           = require('../../helpers/Pagination');
const { filterResultQueries }  = require('../../helpers/Filter');

const getProfiles = async ( req = request, res = response ) => {
  try {
    const queries = req.query;
    
    let rows = await Profile.findAll();

    rows = filterResultQueries( rows, queries, ProfileAttr.filterable );
    rows = pagination( rows, queries, ProfileAttr.filterable );
  
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

const createProfile = async ( req = request, res = response ) => {
  const profileBody = _.pick( req.body, ['profile'] );

  try {
    const profile = await Profile.create({ ...profileBody, status: ProfileAttr.STATUS[0] });
    
    if( profile ) {
      return res.status(201).json({
        ok: true,
        data: profile,
      });
    } else {
      return res.status(400).json({
        ok:     false,
        msg:    'Ha ocurrido un error',
        errors: []
      });
    }
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

const updateProfile = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;
    const profileBody = _.pick( req.body, ['profile', 'status', 'default'] );

    const profile = await Profile.findByPk( id );

    if( !profile ) {
      return res.status(404).json({
        ok:     false,
        msg:    'El perfil no existe',
        errors: []
      });
    }

    /** Avoid to remove the default profile */
    if( Object.hasOwnProperty.call( profileBody, 'default' ) ) {
      if( profile.default && !profileBody.default ) {
        return res.status(404).json({
          ok:     false,
          msg:    'Need provide a default profile',
          errors: []
        });
      }
    }
    
    if( profileBody.default ) {
      Profile.update(
        { default: false }, 
        {
          where: {
            id: {
              [ Op.ne ] : profile.id
            }
          }
        }
      );
    }

    await profile.update( profileBody );

    return res.json({
      ok:   true,
      data: profile,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

const deleteProfile = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findByPk( id );

    if( !profile ) {
      return res.status(404).json({
        ok:     false,
        msg:    'El perfil no existe',
        errors: []
      });
    }

    if( profile.default ) {
      return res.status(400).json({
        ok:     false,
        msg:    "Can't delete the default profile",
        errors: []
      });
    }

    await profile.destroy();

    return res.json({
      ok:   true,
      data: profile,
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
  getProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
};