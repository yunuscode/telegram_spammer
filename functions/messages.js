const { helloKeyboard, getNumberList } = require("./keyboards");
const { createUser, getNumbersCountByCountry } = require("./queries");
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
		} else if (event.text == "Account management") {
			await this.pricesMessage(bot, database, event);
		} else if (event.text.startsWith("Add members")) {
			// await this.addAccounts(bot, database, event);
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
			let indonesianData = await getAccountsPrices(62);
			let russianAccountsCount = await getNumbersCountByCountry(
				database,
				"ru"
			);
			let kazakhAccountsCount = await getNumbersCountByCountry(
				database,
				"kz"
			);
			let indonesianAccountsCount = await getNumbersCountByCountry(
				database,
				"nd"
			);

			let msg_text = `Information\n\n`;

			msg_text += `🇷🇺 Russia: \n- Price in store: ${russianData.services.service_telegram.price} rubl \n- Available numbers in store: ${russianData.services.service_telegram.count} \n- My available numbers: ${russianAccountsCount}\n\n`;
			msg_text += `🇰🇿 Kazakhstan: \n- Price in store: ${kazakhData.services.service_telegram.price} rubl \n- Available numbers in store: ${kazakhData.services.service_telegram.count}\n- My available numbers: ${kazakhAccountsCount}\n\n`;
			msg_text += `🇮🇩 Indonesian: \n- Price in store: ${indonesianData.services.service_telegram.price} rubl \n- Available numbers in store: ${indonesianData.services.service_telegram.count}\n- My available numbers: ${indonesianAccountsCount}\n\n`;

			msg_text += `Note: Blocked numbers remove automatically from list`;

			await bot.editMessageText(msg_text, {
				chat_id: event.chat.id,
				message_id: sentMessage.message_id,
				reply_markup: getNumberList(),
			});
		} catch (error) {
			console.log(error);
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
