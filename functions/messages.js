const { createUser } = require("./queries");

module.exports = class Messages {
	static async sendHello(bot, database, event) {
		await bot.sendMessage(event.chat.id, "Welcome! Select any section!");
		await createUser(database, event.chat.id);
	}
	static async mainMenu(bot, database, event) {
		await bot.sendMessage(event.chat.id, "test");
	}
};
