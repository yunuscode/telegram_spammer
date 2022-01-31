module.exports = class Keyboards {
	static helloKeyboard() {
		return {
			keyboard: [
				["Check balance", "Send Bulk Message"],
				["Account management", "Add members"],
			],
			resize_keyboard: true,
		};
	}
	static getNumberList() {
		return {
			inline_keyboard: [
				[
					{
						text: "🇷🇺 Russia",
						callback_data: "get_russian_number",
					},
				],
				[
					{
						text: "🇰🇿 Kazakhstan",
						callback_data: "get_kazakh_number",
					},
				],
				[
					{
						text: "🇮🇩 Indonesia",
						callback_data: "get_indonesian_number",
					},
				],
			],
		};
	}
};
