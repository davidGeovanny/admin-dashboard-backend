const { Sequelize } = require('sequelize');

const db = new Sequelize( process.env.DB_HOST, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host		: 'localhost',
    dialect	: 'mysql',
		// logging : false,
});

module.exports = db;