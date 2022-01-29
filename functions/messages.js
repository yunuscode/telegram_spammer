const { helloKeyboard } = require("./keyboards");
const { createUser } = require("./queries");
const { checkBalance, getAccountsPrices } = require("./smsService");

module.exports = class Messages {
	static async sendHello(bot, database, event) {
		await bot.sendMessage(event.chat.id, "Welcome! Select any section!", {
			reply_markup: helloKeyboard(),
		});
		await createUser(database, event.chat.id);
	}
	static async mainMenu(bot, database, event) {
		if (event.text == "Check balance") {
			await this.checkBalanceMessage(bot, database, event);
		} else if (event.text == "Prices") {
			await this.pricesMessage(bot, database, event);
		}
	}
	static async pricesMessage(bot, database, event) {
		let sentMessage = await bot.sendMessage(event.chat.id, "Requesting...");
		let data = await getAccountsPrices();

		if (data?.telegram?.russia) {
			let text = ``;
			text += `Prices in Russia:\n`;
			for (const operator in data?.telegram?.russia) {
				text += `${operator}: Price: ${data?.telegram?.russia[operator].cost} || Count: ${data?.telegram?.russia[operator].count}\n`;
			}
			await bot.editMessageText(text, {
				chat_id: event.chat.id,
				message_id: sentMessage.message_id,
			});
		}

		if (data.error)
			await bot.editMessageText("Error when getting balance", {
				chat_id: event.chat.id,
				message_id: sentMessage.message_id,
			});
	}
	static async checkBalanceMessage(bot, database, event) {
		let sentMessage = await bot.sendMessage(event.chat.id, "Checking...");
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
};
