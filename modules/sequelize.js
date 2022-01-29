const { Sequelize, DataTypes } = require("sequelize");
const UserModel = require("../model/UserModel");

const sequelize = new Sequelize(process.env.PG_CONNECTION_STRING, {
	logging: false,
});

module.exports = async function psql() {
	try {
		let db = {};
		db.users = await UserModel(sequelize, Sequelize);

		await sequelize.sync({ force: true });
	} catch (error) {
		console.log(error);
	}
};
