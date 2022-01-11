const { response, request } = require('express');

const { Employee, User } = require('../../models');

const { formatSequelizeError } = require('../../helpers/FormatSequelizeError');

const getEmployeeUsers = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;

    const row = await Employee.findByPk( id, {
      include: [
        {
          model: User.scope( 'activeUsersScope' ),
          as: 'users',
        },
      ]
    });

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