require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const psql = require("./modules/sequelize");

async function bot() {
	await psql();
}

bot();
