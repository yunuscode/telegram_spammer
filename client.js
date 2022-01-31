const MTProto = require("@mtproto/core");
const path = require("path");
const input = require("input");
const sleep = require("sleep");

require("dotenv").config();

// console.log(process.env.TELEGRAM_APP_ID, process.env.TELEGRAM_APP_HASH);

class API {
	constructor(API_ID, API_HASH, phone_number) {
		this.mtproto = new MTProto({
			api_id: API_ID,
			api_hash: API_HASH,

			storageOptions: {
				path: path.resolve(__dirname, `./data/${phone_number}.json`),
			},
		});
	}

	async call(method, params, options = {}) {
		try {
			const result = await this.mtproto.call(method, params, options);

			return result;
		} catch (error) {
			const { error_code, error_message } = error;

			if (error_code === 420) {
				const seconds = Number(error_message.split("FLOOD_WAIT_")[1]);
				const ms = seconds * 1000;

				await sleep.msleep(ms);

				return this.call(method, params, options);
			}

			if (error_code === 303) {
				const [type, dcIdAsString] = error_message.split("_MIGRATE_");

				const dcId = Number(dcIdAsString);

				// If auth.sendCode call on incorrect DC need change default DC, because
				// call auth.signIn on incorrect DC return PHONE_CODE_EXPIRED error
				if (type === "PHONE") {
					await this.mtproto.setDefaultDc(dcId);
				} else {
					Object.assign(options, { dcId });
				}

				return this.call(method, params, options);
			}

			return Promise.reject(error);
		}
	}
}

// const CustomTelegramClient = new

// API(
// 	process.env.TELEGRAM_APP_ID,
// 	process.env.TELEGRAM_APP_HASH
// );

module.exports = API;
