const { request, response } = require('express');
const { Op } = require('sequelize');
const _      = require('underscore');

const { Profile } = require('../models');

const { attrProfiles }  = require('../data/attr-profiles');
const { profileStatus } = require('../data/static-data');
const { formatSequelizeError } = require('../helpers/format-sequelize-error');
const { pagination }           = require('../helpers/pagination');
const { GET_CACHE, SET_CACHE, CLEAR_CACHE } = require('../helpers/cache');

const getProfiles = async ( req = request, res = response ) => {
  try {
    const { keys, list } = attrProfiles;
    const queries = req.query;
    
    let rows = JSON.parse( GET_CACHE( keys.all ) );

    if( !rows ) {
      rows = await Profile.findAll();
      SET_CACHE( keys.all, JSON.stringify( rows ), 60000 );
    }

    const paginated = pagination( rows, queries, list );
  
    return res.json({
      ok: true,
      ...paginated
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

const createProfile = async ( req = request, res = response ) => {
  const profileBody = _.pick( req.body, ['profile'] );

  try {
    const profile = await Profile.create({ ...profileBody, status: profileStatus[0] });
    CLEAR_CACHE( attrProfiles.keys.all );
    
    if( profile ) {
      return res.status(201).json({
        ok: true,
        data: profile,
      });
    } else {
      return res.status(400).json({
        ok:     false,
        msg:    'An error has ocurred',
        errors: {}
      });
    }
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'An error has ocurred',
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
        msg:    'The profile does not exist',
        errors: []
      });
    }

    /** Avoid to remove the default profile */
    if( Object.hasOwnProperty.call( profileBody, 'default' ) ) {
      if( profile.default && !profileBody.default ) {
        return res.status(404).json({
          ok:     false,
          msg:    'Need provide a default profile',
          errors: {}
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
    CLEAR_CACHE( attrProfiles.keys.all );

    return res.json({
      ok:   true,
      data: profile,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'An error has ocurred',
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
        msg:    'The profile does not exist',
        errors: {}
      });
    }

    if( profile.default ) {
      return res.status(400).json({
        ok:     false,
        msg:    "Can't delete the default profile",
        errors: {}
      });
    }

    await profile.destroy();
    CLEAR_CACHE( attrProfiles.keys.all );

    return res.json({
      ok:   true,
      data: profile,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'An error has ocurred',
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