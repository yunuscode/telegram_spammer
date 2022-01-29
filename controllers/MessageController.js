const Messages = require("../functions/messages");
const { getUser } = require("../functions/queries");

module.exports = async function MessageController(bot, database, event) {
	let user = await getUser(database, event.chat.id);

	if (!user) {
		await Messages.sendHello(bot, database, event);
	} else if (user.dataValues.step === 1) {
		await Messages.mainMenu(bot, database, event);
	}
};
