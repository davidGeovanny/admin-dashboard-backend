const { request, response } = require('express');

const { Profile, User } = require('../../models');

const { formatSequelizeError } = require('../../helpers/FormatSequelizeError');

const getProfileUsers = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;

    const row = await Profile.findByPk( id, {
      include: [
        {
          model: User.scope( 'activeUsersScope' ),
          as: 'users',
          through: {
            attributes: []
          }
        },
      ],
    });

    if( !row ) {
      return res.status(404).json({
        ok:     false,
        msg:    'El perfil no existe',
        errors: []
      });
    }
  
    return res.json({
      ok:   true,
      data: row
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
  getProfileUsers,
};