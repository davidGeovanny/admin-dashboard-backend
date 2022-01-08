const { query } = require('express-validator');

const saleGetRules = [
  /** Query */
  query('initDate')
    .notEmpty()
    .withMessage('Necesita proporcionar una fecha inicial para buscar las ventas')
    .isDate()
    .withMessage('Necesita proporcionar una fecha válida'),
  query('finalDate')
    .notEmpty()
    .withMessage('Necesita proporcionar una fecha final para buscar las ventas')
    .isDate()
    .withMessage('Necesita proporcionar una fecha válida'),
];

const topClientsGetRules = [
  ...saleGetRules,
  query('limit')
    .optional()
    .notEmpty()
    .withMessage('Necesita proveer un límite de registros')
]

module.exports = {
  saleGetRules,
  topClientsGetRules,
};