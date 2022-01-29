const axios = require("axios").default;

module.exports = class SmsService {
	static async checkBalance() {
		try {
			let response = await axios.get("https://5sim.net/v1/user/profile", {
				headers: {
					Authorization: `Bearer ${process.env.SIMAPI}`,
				},
			});
			return response.data;
		} catch (error) {
			return {
				error: true,
			};
		}
	}
	static async getAccountsPrices() {
		try {
			let response = await axios.get(
				"https://5sim.net/v1/guest/prices?product=telegram",

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
