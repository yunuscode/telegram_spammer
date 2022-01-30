const { Sequelize, DataTypes } = require("sequelize");
const AccountModel = require("../model/AccountModel");
const UserModel = require("../model/UserModel");

const sequelize = new Sequelize(process.env.PG_CONNECTION_STRING, {
	logging: false,
});

module.exports = async function psql() {
	try {
		let db = {};
		db.users = await UserModel(sequelize, Sequelize);
		db.accounts = await AccountModel(sequelize, Sequelize);

		await sequelize.sync({ force: false });

		return db;
	} catch (error) {
		console.log(error);
	}
};
