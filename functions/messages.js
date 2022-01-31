const { addNewUser } = require("../test");
const { helloKeyboard, getNumberList } = require("./keyboards");
const { createUser, getNumbersCountByCountry } = require("./queries");
const {
	checkBalance,
	getAccountsPrices,
	getOrder,
	getState,
	setRevise,
} = require("./smsService");

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

	static async addAccountMessage(bot, database, event, cb_data) {
		let sentMessage = await bot.sendMessage(
			event.chat.id,
			`⚡️ <b>Attempting to getting number has been started</b>\n\n<i>- This message is updated automatically</i>`,
			{
				parse_mode: "html",
			}
		);

		let order, order_state;

		if (cb_data == "get_indonesian_number") {
			order = await getOrder(62);
			console.log(order);
			if (order?.response !== 1 || order.error) {
				bot.editMessageText(`Error with number's count or balance`, {
					chat_id: event.chat.id,
					message_id: sentMessage.message_id,
				});
				return;
			}

			// order = {
			// 	tzid: 53244320,
			// };
		}

		order_state = await getState(order.tzid);

		order_state = order_state[0];
		order_state.number = +order_state.number;

		console.log(order_state);

		// 7 - Russia, 77 - Kazakhstan, 62 - Indonesia

		// let order = await getOrder()

		const account = await database.accounts.create({
			account_id: order.tzid,
			account_number: order_state.number,
			account_country: "nd",
		});

		let result = await addNewUser(
			`${order_state.number}`,
			async function () {
				async function getSMSResult(attemt) {
					let data = await getState(order.tzid);
					data = data[0];

					if (data?.msg) {
						return data?.msg[data?.msg.length - 1].msg;
					}

					if (attemt == 5) {
						return false;
					}

					return await new Promise((resolve, reject) => {
						setTimeout(() => {
							resolve(getSMSResult(attemt + 1));
						}, 20000);
					});
				}

				return await getSMSResult(1);
			},
			setRevise,
			order.tzid
		);

		console.log(result);
	}
};
