const Messages = require("../functions/messages");
const { getUser } = require("../functions/queries");

module.exports = async function CallbackController(bot, database, event) {
	let user = await getUser(database, event.message.chat.id);

	if (!user) {
		await Messages.sendHello(bot, database, event.message);
	} else if (event.data) {
		console.log(event.data);
		// await Messages.mainMenu(bot, database, event);
	}
};
