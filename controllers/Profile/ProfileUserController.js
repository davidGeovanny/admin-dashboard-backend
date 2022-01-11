const { request, response } = require('express');

const { Profile, User } = require('../../models');
const ProfileAttr       = require('../../utils/classes/ProfileAttr');
const UserAttr          = require('../../utils/classes/UserAttr');

const { GET_CACHE, SET_CACHE } = require('../../helpers/Cache');
const { formatSequelizeError } = require('../../helpers/FormatSequelizeError');

const getProfileUsers = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;
    const key    = `${ ProfileAttr.SECTION }(${id}).${ UserAttr.SECTION }`;

    let row = JSON.parse( GET_CACHE( key ) );

    if( !row ) {
      row = await Profile.findByPk( id, {
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
      SET_CACHE( key, JSON.stringify( row ), 60000 );
    }

    if( !row ) {
      return res.status(404).json({
        ok:     false,
        msg:    'El perfil no existe',
        errors: []
      });
    }
  
    return res.json({
      ok: true,
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