const axios = require("axios").default;

module.exports = class SmsService {
	static async checkBalance() {
		try {
			let response = await axios.get(
				"https://onlinesim.ru/api/getBalance.php?apikey=" +
					process.env.SIM_API,
				{}
			);
			return response.data;
		} catch (error) {
			return {
				error: true,
			};
		}
	}
	static async getAccountsPrices(country) {
		try {
			let response = await axios.get(
				"https://onlinesim.ru/api/getNumbersStats.php?apikey=" +
					process.env.SIM_API +
					"&country=" +
					country
			);
			return response.data;
		} catch (error) {
			console.log(error);
			return {
				error: true,
			};
		}
	}
	static async getOrder() {
		try {
			let response = await axios.get(
				"https://5sim.net/v1/user/buy/activation/russia/any/telegram",
				{
					headers: {
						Authorization: `Bearer ${process.env.SIMAPI}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			console.log(error);
			return {
				error: true,
			};
		}
	}
};
