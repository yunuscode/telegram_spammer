const API = require("./client");
const input = require("input");

// module.exports.sendMessageByUser =

async function sendMessageByUser(phone_number, username) {
	const mtproto = new API(
		process.env.TELEGRAM_APP_ID,
		process.env.TELEGRAM_APP_HASH,
		phone_number
	);

	const user = await getUser(mtproto);

	let r = await mtproto.call("messages.getAllChats", {
		except_ids: [],
	});

	const channels = r.chats.filter((e) => e._ == "channel");
	// console.log(channels.length);

	for (let i of channels) {
		let x = await mtproto.call("channels.leaveChannel", {
			channel: {
				_: "inputPeerChannel",
				channel_id: i.id,
				access_hash: i.access_hash,
			},
		});
		console.log(x);
	}

	// if (user) {
	// 	let result = await searchByUsername(mtproto, "muhammad_yunusoff");
	// 	await sendMessage(mtproto, result);
	// 	console.log(result);
	// }
}

// module.exports.addNewUser =
async function addNewUser(phone_number) {
	const mtproto = new API(
		process.env.TELEGRAM_APP_ID,
		process.env.TELEGRAM_APP_HASH,
		phone_number
	);

	const phone = phone_number;
	const { phone_code_hash } = await sendCode(mtproto, phone);

	try {
		const code = await input.text("Code");

		const signInResult = await signIn(mtproto, {
			code,
			phone,
			phone_code_hash,
		});

		if (signInResult._ === "auth.authorizationSignUpRequired") {
			await signUp(mtproto, {
				phone,
				phone_code_hash,
			});
		}
	} catch (error) {
		if (error.error_message !== "SESSION_PASSWORD_NEEDED") {
			console.log(`error:`, error);

			return;
		}

		// 2FA

		const password = "uZ_6860665";

		const { srp_id, current_algo, srp_B } = await getPassword(mtproto);
		const { g, p, salt1, salt2 } = current_algo;

		const { A, M1 } = await mtproto.mtproto.crypto.getSRPParams({
			g,
			p,
			salt1,
			salt2,
			gB: srp_B,
			password,
		});

		const checkPasswordResult = await checkPassword(mtproto, {
			srp_id,
			A,
			M1,
		});

		console.log(checkPasswordResult);
	}
}

async function searchByUsername(api, username) {
	try {
		let results = await api.call("contacts.search", {
			q: username,
			limit: 1,
		});
		return {
			id: results.users[0]?.id,
			hash: results.users[0]?.access_hash,
		};
	} catch (error) {
		console.log(error);
	}
}

async function sendMessage(api, user_data, text) {
	try {
		return await api.call("messages.sendMessage", {
			clear_draft: true,
			peer: {
				_: "inputPeerUser",
				user_id: user_data.id,
				access_hash: user_data.hash,
			},
			message: "Hello @mtproto_core",

			random_id:
				Math.ceil(Math.random() * 0xffffff) +
				Math.ceil(Math.random() * 0xffffff),
		});
	} catch (error) {
		console.log(error + "");
	}
}

async function getUser(api) {
	try {
		const user = await api.call("users.getFullUser", {
			id: {
				_: "inputUserSelf",
			},
		});

		return user;
	} catch (error) {
		return null;
	}
}

function sendCode(api, phone) {
	return api.call("auth.sendCode", {
		phone_number: phone,
		settings: {
			_: "codeSettings",
		},
	});
}

function signIn(api, { code, phone, phone_code_hash }) {
	return api.call("auth.signIn", {
		phone_code: code,
		phone_number: phone,
		phone_code_hash: phone_code_hash,
	});
}

function signUp(api, { phone, phone_code_hash }) {
	return api.call("auth.signUp", {
		phone_number: phone,
		phone_code_hash: phone_code_hash,
		first_name: "MTProto",
		last_name: "Core",
	});
}

function getPassword(api) {
	return api.call("account.getPassword");
}

function checkPassword(api, { srp_id, A, M1 }) {
	return api.call("auth.checkPassword", {
		password: {
			_: "inputCheckPasswordSRP",
			srp_id,
			A,
			M1,
		},
	});
}

// addNewUser(77756838012);
sendMessageByUser(77756838012);
