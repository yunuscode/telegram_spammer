module.exports = class Keyboards {
	static helloKeyboard() {
		return {
			keyboard: [
				["Check balance", "Send Bulk Message"],
				["Account stats", "Add accounts"],
				["Add members"],
			],
			resize_keyboard: true,
		};
	}
};
