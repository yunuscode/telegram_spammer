module.exports = async function AccountModel(sequelize, Sequelize) {
	return await sequelize.define("accounts", {
		account_id: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		is_blocked: {
			type: Sequelize.DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		account_number: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false,
		},
		is_cancalled: {
			type: Sequelize.DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		code: {
			type: Sequelize.DataTypes.STRING,
			allowNull: true,
		},
		account_country: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false,
		},
	});
};
