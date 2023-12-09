const { response, request } = require('express');
const { Op, Sequelize }     = require('sequelize');
const _ = require('underscore');

const { DeliveryPointCommissionConfig, BranchCompany } = require('../../models');
const DeliveryPointCommissionConfigAttr = require('../../utils/classes/DeliveryPointCommissionConfigAttr');

const { formatSequelizeError } = require('../../helpers/FormatSequelizeError');
const { pagination }           = require('../../helpers/Pagination');
const { filterResultQueries }  = require('../../helpers/Filter');
const ProductType = require('../../models/ProductType');

const getDeliveryPointCommissionConfig = async ( req = request, res = response ) => {
  try {
    const queries = req.query;

    let rows = await DeliveryPointCommissionConfig.findAll(
      {
        raw: true,
        nest: true,
        include: [
          {
            model: BranchCompany,
            as: 'branch',
            attributes: ['branch'],
          },
          {
            model: ProductType,
            as: 'product_type',
            attributes: ['type_product'],
          }
        ],
        attributes: [
          'id',
          'min_range',
          'max_range',
          'percent',
          'id_branch_company',
          'branch.branch',
          'product_type.type_product',
        ]
      }
    );

    rows = filterResultQueries( rows, queries, DeliveryPointCommissionConfigAttr.filterable );
    rows = pagination( rows, queries, DeliveryPointCommissionConfigAttr.filterable );
  
    return res.json({
      ok: true,
      ...rows
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

const createDeliveryPointCommissionConfig = async ( req = request, res = response ) => {
  try {
    let configBody = _.pick( req.body, [
      'min_range',
      'max_range',
      'percent',
      'id_branch_company',
      'type_product',
    ]);

    //-> Buscar tipo producto donde type_product sea igual a configBody.type_product
    const productType = await ProductType.findOne({
      where: {
        type_product: {
          [ Op.eq ] : configBody.type_product
        }
      }
    });

    if( !productType ) {
      return res.status(400).json({
        ok: false,
        msg: 'El tipo de producto no existe',
        errors: []
      });
    }

    configBody.id_type_product = productType.id;

    /** Avoid min and max ranges from being between other rows */
    const available = await checkRangesAreAvailabe(
      configBody.id_branch_company,
      configBody.min_range,
      configBody.max_range,
      productType.id,
    );

    if( !available ) {
      return res.status(400).json({
        ok:     false,
        msg:    'Ya existe una configuración que está entre los valores mínimos y máximos',
        errors: []
      });
    }

    const deliveryPointCommissionConfig = await DeliveryPointCommissionConfig.create( configBody );

    return res.json({
      ok: true,
      data: deliveryPointCommissionConfig,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

const updateDeliveryPointCommissionConfig = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;
    
    const configBody = _.pick( req.body, [
      'min_range',
      'max_range',
      'percent',
      'id_branch_company',
      'type_product',
    ]);

    const deliveryPointCommissionConfig = await DeliveryPointCommissionConfig.findByPk( id );

    if( !deliveryPointCommissionConfig ) {
      return res.status(400).json({
        ok: false,
        msg: 'La configuración no existe',
        errors: []
      });
    }

    //-> Buscar tipo producto donde type_product sea igual a configBody.type_product
    const productType = await ProductType.findOne({
      where: {
        type_product: {
          [ Op.eq ] : configBody.type_product
        }
      }
    });

    /** Avoid min and max ranges from being between other rows */
    const available = await checkRangesAreAvailabe(
      configBody.id_branch_company,
      configBody.min_range,
      configBody.max_range,
      productType.id,
      id,
    );

    configBody.id_type_product = productType.id;

    if( !available ) {
      return res.status(400).json({
        ok:     false,
        msg:    'Ya existe una configuración que está entre los valores mínimos y máximos',
        errors: []
      });
    }

    await deliveryPointCommissionConfig.update( configBody );

    return res.json({
      ok:   true,
      data: deliveryPointCommissionConfig,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

const deleteDeliveryPointCommissionConfig = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;

    const deliveryPointCommissionConfig = await DeliveryPointCommissionConfig.findByPk( id );

    if( !deliveryPointCommissionConfig ) {
      return res.status(400).json({
        ok:     false,
        msg:    'La configuración no existe',
        errors: []
      });
    }

    await deliveryPointCommissionConfig.destroy();

    return res.json({
      ok:   true,
      data: deliveryPointCommissionConfig,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

const checkRangesAreAvailabe = async ( id_branch_company, min_range, max_range, id_type_product, id = 0 ) => {
  try {
    const configs = await DeliveryPointCommissionConfig.findOne({
      where: {
        id_branch_company: {
          [ Op.eq ] : id_branch_company
        },
        id_type_product: {
          [ Op.eq ] : id_type_product
        },
        [ Op.or ] : [
          Sequelize.literal(`
            ${ min_range } BETWEEN DeliveryPointCommissionConfig.min_range AND DeliveryPointCommissionConfig.max_range
          `),
          Sequelize.literal(`
            ${ max_range } BETWEEN DeliveryPointCommissionConfig.min_range AND DeliveryPointCommissionConfig.max_range
          `),
        ],
        id: {
          [ Op.ne ] : id
        }
      }
    });

    return !!!configs;
    // return configs ? false : true;
  } catch ( err ) {
    return false;
  }
}

module.exports = {
  getDeliveryPointCommissionConfig,
  createDeliveryPointCommissionConfig,
  updateDeliveryPointCommissionConfig,
  deleteDeliveryPointCommissionConfig,
};