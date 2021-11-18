const { query } = require('express-validator');

const saleGetRules = [
  /** Query */
  query('initDate')
    .notEmpty()
    .withMessage('Need to provide an init date for search sales')
    .isDate()
    .withMessage('Need to provide a valid date'),
  query('finalDate')
    .notEmpty()
    .withMessage('Need to provide a final date for search sales')
    .isDate()
    .withMessage('Need to provide a valid date'),
];

const topClientsGetRules = [
  ...saleGetRules,
  query('limit')
    .optional()
    .notEmpty()
    .withMessage('Need to provide a limit of clients')
]

module.exports = {
  saleGetRules,
  topClientsGetRules,
};