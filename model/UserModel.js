module.exports = async function UserModel(sequelize, Sequelize) {
	return await sequelize.define("users", {
		chat_id: {
			type: Sequelize.DataTypes.BIGINT,
			allowNull: false,
			unique: true,
		},
		step: {
			type: Sequelize.DataTypes.SMALLINT,
			allowNull: false,
		},
	});
};
