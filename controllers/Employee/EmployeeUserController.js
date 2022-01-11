const { response, request } = require('express');

const { Employee, User } = require('../../models');
const EmployeeAttr       = require('../../utils/classes/EmployeeAttr');
const UserAttr           = require('../../utils/classes/UserAttr');

const { GET_CACHE, SET_CACHE } = require('../../helpers/Cache');
const { formatSequelizeError } = require('../../helpers/FormatSequelizeError');

const getEmployeeUsers = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;
    const key    = `${ EmployeeAttr.SECTION }(${id}).${ UserAttr.SECTION }`;

    let row = JSON.parse( GET_CACHE( key ) );

    if( !row ) {
      row = await Employee.findByPk( id, {
        include: [
          {
            model: User.scope( 'activeUsersScope' ),
            as: 'users',
          },
        ]
      });
      SET_CACHE( key, JSON.stringify( row ), 60000 );
    }

    if( !row ) {
      return res.status(404).json({
        ok:     false,
        msg:    'El empleado no existe',
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
  getEmployeeUsers,
};