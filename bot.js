const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input"); // npm i input

const apiId = 12484911;
const apiHash = "f614d3050d38775a1696d09c4ecd7e71";
const stringSession = new StringSession(
	"1AgAOMTQ5LjE1NC4xNjcuNDEBuxLYib+x2S99t2HfG/vU7zJh89bUE2E4356MCQPj6tnFjsxLwsrg7VpvvMBC79C5+i+xXNFfhURIufpP0UFHeRnmIt4/X7u8juxtutjROf23RBMnX4cFhUk2DMRESb2VDJyhqlVdYH9AIiCVOUo+5N44UKN7tOR9e70OuSbbUjLjAybkURUZdEWfOYPDmrS3e7qvbJ/qjQnZR6Durx/h0YWvW3k1YBpCmS+AqVL9++tnSjeGMqVmOHhbg2XmhPhOI7rKWDX6sZE8woegEpGSejX0enGzQvSdwR9ds5Bd2j/BjwvQ124S4hub0lX9K7nSjLrkvTlOhsGoLSsumv8kTTY="
); // fill this later with the value from session.save()

(async () => {
	console.log("Loading interactive example...");
	const client = new TelegramClient(stringSession, apiId, apiHash, {
		connectionRetries: 5,
	});
	await client.start({
		phoneNumber: async () => await input.text("Please enter your number: "),
		password: async () => await input.text("Please enter your password: "),
		phoneCode: async () =>
			await input.text("Please enter the code you received: "),
		onError: (err) => console.log(err),
	});
	console.log("You should now be connected.");
	console.log(client.session.save()); // Save this string to avoid logging in again
	let test = await client.sendMessage("funnypunk", {
		message: "Hello, this message sent via Custom telegram client!",
	});
	console.log(test);
})();
