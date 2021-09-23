const { request, response } = require('express');
const { Op } = require('sequelize');
const _ = require('underscore');

const { Profile, User } = require('../models');

const getProfiles = async ( req = request, res = response ) => {
  try {
    const profiles = await Profile.findAll();

    res.json({
      ok: true,
      profiles
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: err
    });
  }
}

const createProfile = async ( req = request, res = response ) => {
  const profileBody = _.pick( req.body, ['profile'] );

  try {
    const profile = await Profile.create( profileBody );
    
    if( profile ) {
      res.status(201).json({
        ok: true,
        profile,
      });
    } else {
      res.status(400).json({
        ok: false,
        msg: 'An error has ocurred',
        errors: {}
      });
    }
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: err
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
        ok: false,
        msg: 'The profile does not exist',
        errors: {}
      });
    }

    if( Object.hasOwnProperty.call( profileBody, 'default' ) ) {
      if( profile.default && !profileBody.default ) {
        return res.status(404).json({
          ok: false,
          msg: 'Need provide a default profile',
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

    profile.update( profileBody );

    res.json({
      ok: true,
      profile,
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: err
    });
  }
}

const deleteProfile = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findByPk( id );

    if( !profile ) {
      return res.status(404).json({
        ok: false,
        msg: 'The profile does not exist',
        errors: {}
      });
    }

    if( profile.default ) {
      return res.status(400).json({
        ok: false,
        msg: "Can't delete the default profile",
        errors: {}
      });
    }

    profile.destroy();

    res.json({
      ok: true,
      profile,
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: err
    });
  }
}

module.exports = {
  getProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
};