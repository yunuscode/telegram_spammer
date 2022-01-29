const { helloKeyboard } = require("./keyboards");
const { createUser } = require("./queries");
const { checkBalance } = require("./smsService");

module.exports = class Messages {
	static async sendHello(bot, database, event) {
		await bot.sendMessage(event.chat.id, "Welcome! Select any section!", {
			reply_markup: helloKeyboard(),
		});
		await createUser(database, event.chat.id);
	}
	static async mainMenu(bot, database, event) {
		if (event.text == "Check balance") {
			let sentMessage = await bot.sendMessage(
				event.chat.id,
				"Checking..."
			);
			let data = await checkBalance();
			if (data.balance)
				bot.editMessageText(`Current balance is ${data.balance} rubl`, {
					chat_id: event.chat.id,
					message_id: sentMessage.message_id,
				});

			if (data.error)
				bot.editMessageText("Error when getting balance", {
					chat_id: event.chat.id,
					message_id: sentMessage.message_id,
				});
		}
	}
};
