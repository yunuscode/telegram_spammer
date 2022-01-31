require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const CallbackController = require("./controllers/CallbackController");
const MessageController = require("./controllers/MessageController");
const psql = require("./modules/sequelize");

const botInstance = new TelegramBot(process.env.TOKEN, {
	polling: true,
});

async function bot() {
	let database = await psql();

	botInstance.on(
		"message",
		async (event) => await MessageController(botInstance, database, event)
	);

	botInstance.on(
		"callback_query",
		async (event) => await CallbackController(botInstance, database, event)
	);
}

bot();
