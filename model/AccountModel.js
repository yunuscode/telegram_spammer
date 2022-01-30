module.exports = async function AccountModel(sequelize, Sequelize) {
	return await sequelize.define("users", {
		account_id: {
			type: Sequelize.DataTypes.INTEGER,
			allowNull: false,
			unique: true,
			autoIncrement: true,
		},
		isBlocked: {
			type: Sequelize.DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	});
};
