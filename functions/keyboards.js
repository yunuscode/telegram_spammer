module.exports = class Keyboards {
	static helloKeyboard() {
		return {
			keyboard: [
				["Check balance", "Send Bulk Message"],
				["Account stats", "Add accounts"],
				["Add members", "Prices"],
			],
			resize_keyboard: true,
		};
	}
};
