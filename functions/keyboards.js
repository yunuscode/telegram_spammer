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
};
