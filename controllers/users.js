const { response, request } = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const _      = require('underscore');

const { User, Profile, ProfileUser } = require('../models');

const { userStatus } = require('../data/static-data');

const getUsers = async ( req = request, res = response ) => {
  try {
    const users = await User.findAll();
    
    res.json({
      ok: true,
      users
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: err
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
    }

    res.json({
      ok: true,
      user,
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: err
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
        msg: 'The user does not exist',
        errors: {}
      });
    }

    await user.update( userBody );

    res.json({
      ok: true,
      user,
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: err
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
        ok: false,
        msg: 'The user does not exist',
        errors: {}
      });
    }

    const validPassword = bcrypt.compareSync( userBody.current_password, user.password );

    if( !validPassword ) {
      return res.status(400).json({
        ok: false,
        msg: 'Current password is not correct',
        errors: {}
      });
    }

    await user.update( userBody );

    res.json({
      ok: true,
      user,
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: err
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
        ok: false,
        msg: 'The user does not exist',
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
        ok: true,
        user
      });
    }
    
    const profile = await Profile.scope('activeProfileScope').findByPk( id_profile );
    
    if( !profile ) {
      return res.status(404).json({
        ok: false,
        msg: "Can't add the selected profile. Check selected profile is activated",
        errors: {}
      });
    }

    await user.addProfile( id_profile );

    res.json({
      ok: true,
      user,
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: err
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
        ok: false,
        msg: 'The user does not exist',
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
        ok: false,
        msg: 'The user does not have the selected profile',
        errors: {}
      });
    }

    await profile_user.destroy();

    res.json({
      ok: true,
      user,
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: err
    });
  }
}

const deleteUser = async ( req = request, res = response ) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk( id );

    if( !user ) {
      return res.status(404).json({
        ok: false,
        msg: 'The user does not exist',
        errors: {}
      });
    }

    await user.destroy();

    res.json({
      ok: true,
      user,
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
  getUsers,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  userAddProfile,
  userRemoveProfile,
};