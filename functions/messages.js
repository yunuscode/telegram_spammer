const { helloKeyboard } = require("./keyboards");
const { createUser } = require("./queries");
const { checkBalance, getAccountsPrices, getOrder } = require("./smsService");

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
		} else if (event.text.startsWith("Add accounts")) {
			await this.addAccounts(bot, database, event);
		}
	}
	static async addAccounts(bot, database, event) {
		let sentMessage = await bot.sendMessage(event.chat.id, "Trying...");
		let data = await getOrderQuickly();
		console.log(data);

		async function getOrderQuickly() {
			let response = await getOrder();
			console.log(response);
			if (response == "no free phones") {
				setTimeout(async () => {
					response = await getOrderQuickly();
				}, 60);
			} else {
				return response;
			}
		}
	}
	static async pricesMessage(bot, database, event) {
		let sentMessage = await bot.sendMessage(event.chat.id, "Requesting...");
		try {
			let russianData = await getAccountsPrices(7);
			let kazakhData = await getAccountsPrices(77);

			let msg_text = `Prices\n\n`;

			msg_text += `Russia: Price: ${russianData.services.service_telegram.price} rubl || Count: ${russianData.services.service_telegram.count}\n\n`;
			msg_text += `Kazakhstan: Price: ${kazakhData.services.service_telegram.price} rubl || Count: ${kazakhData.services.service_telegram.count}\n\n`;

			await bot.editMessageText(msg_text, {
				chat_id: event.chat.id,
				message_id: sentMessage.message_id,
			});
		} catch (error) {
			await bot.editMessageText("Error when getting balance", {
				chat_id: event.chat.id,
				message_id: sentMessage.message_id,
			});
		}
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
