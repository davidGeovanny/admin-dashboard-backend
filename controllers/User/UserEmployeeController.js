const { response, request } = require('express');

const { User, Employee } = require('../../models');

const { formatSequelizeError } = require('../../helpers/FormatSequelizeError');

const getUserEmployee = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;

    const row = await User.findByPk( id, {
      include: [
        {
          model: Employee,
          as:    'employee',
        },
      ],
    });

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