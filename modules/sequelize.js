const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.PG_CONNECTION_STRING);

module.exports = async function psql() {
	try {
		await sequelize.authenticate();
	} catch (error) {
		console.log(error);
	}
};
