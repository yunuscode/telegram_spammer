module.exports = class Queryies {
	static async getUser(db, chat_id) {
		let user = await db.users.findOne({
			where: {
				chat_id: chat_id,
			},
		});
		return await user;
	}
	static async createUser(db, chat_id) {
		let user = await db.users.create({ chat_id, step: 1 });
		return user;
	}
};
