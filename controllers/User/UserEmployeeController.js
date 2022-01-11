const { response, request } = require('express');

const { User, Employee } = require('../../models');
const UserAttr = require('../../utils/classes/UserAttr');
const ProfileAttr = require('../../utils/classes/ProfileAttr');

const { GET_CACHE, SET_CACHE } = require('../../helpers/Cache');
const { formatSequelizeError } = require('../../helpers/FormatSequelizeError');

const getUserEmployee = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;
    const key    = `${ UserAttr.SECTION }(${id}).${ ProfileAttr.SECTION }`;

    let row = JSON.parse( GET_CACHE( key ) );

    if( !row ) {
      row = await User.findByPk( id, {
        include: [
          {
            model: Employee,
            as:    'employee',
          },
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

module.exports = {
  getUserEmployee,
};