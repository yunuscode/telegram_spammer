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
	static async getOrder(country) {
		try {
			let response = await axios.get(
				"https://onlinesim.ru/api/getNum.php?apikey=" +
					process.env.SIM_API +
					"&service=telegram&country=" +
					country,
				{}
			);
			return response.data;
		} catch (error) {
			console.log(error);
			return {
				error: true,
			};
		}
	}

	static async getState(id) {
		try {
			let response = await axios.get(
				"https://onlinesim.ru/api/getState.php?apikey=" +
					process.env.SIM_API +
					"&tzid=" +
					id +
					"&message_to_code=1&msg_list=1",
				{}
			);
			return response.data;
		} catch (error) {
			console.log(error);
			return {
				error: true,
			};
		}
	}

	static async setRevise(id) {
		try {
			let response = await axios.get(
				"https://onlinesim.ru/api/setOperationRevise.php?apikey=" +
					process.env.SIM_API +
					"&tzid=" +
					id,
				{}
			);
			console.log(response.data);
			return response.data;
		} catch (error) {
			console.log(error);
			return {
				error: true,
			};
		}
	}

	static async setOk(id) {
		try {
			let response = await axios.get(
				"https://onlinesim.ru/api/setOperationOk.php?apikey=" +
					process.env.SIM_API +
					"&tzid=" +
					id,
				{}
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
