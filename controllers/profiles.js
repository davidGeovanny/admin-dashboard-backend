const { request, response } = require('express');
const { Op } = require('sequelize');

const Profile = require('../models/profile');

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
      msg: 'Ha ocurrido un error',
      errors: err
    });
  }
}

const getSpecificProfile = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;
    console.log({id})

    const profile = await Profile.findOne({
      where: {
        id: {
          [ Op.eq ] : id
        }
      },
    });

    if( profile ) {
      res.json({
        ok: true,
        profile
      });
    } else {
      res.status(400).json({
        ok: false,
        msg: 'The profile not exists',
        errors: {}
      });
    }
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'Ha ocurrido un error',
      errors: err
    });
  }
}

const createProfile = async ( req = request, res = response ) => {
  const { profile: profileReq } = req.body;

  try {
    const profile = new Profile({ profile: profileReq });
    await profile.save();
    
    if( profile ) {
      res.status(201).json({
        ok: true,
        profile,
      });
    } else {
      res.status(400).json({
        ok: false,
        msg: 'Ha ocurrido un error',
        errors: {}
      });
    }
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'Ha ocurrido un error',
      errors: err
    });
  }
}

module.exports = {
  getProfiles,
  getSpecificProfile,
  createProfile,
};