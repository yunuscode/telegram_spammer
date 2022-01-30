const api = require("./client");
const input = require("input");

(async () => {
	const user = await getUser();

	// console.log(user);

	if (!user) {
		const phone = await input.text("Phone");
		const { phone_code_hash } = await sendCode(phone);

		try {
			const code = await input.text("Code");

			const signInResult = await signIn({
				code,
				phone,
				phone_code_hash,
			});

			if (signInResult._ === "auth.authorizationSignUpRequired") {
				await signUp({
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

			const password = "USER_PASSWORD";

			const { srp_id, current_algo, srp_B } = await getPassword();
			const { g, p, salt1, salt2 } = current_algo;

			const { A, M1 } = await api.mtproto.crypto.getSRPParams({
				g,
				p,
				salt1,
				salt2,
				gB: srp_B,
				password,
			});

			const checkPasswordResult = await checkPassword({ srp_id, A, M1 });
		}
	}

	if (user) {
		let result = await searchByUsername("muhammad_yunusoff");
		await sendMessage(result);
		console.log(result);
	}
})();

async function searchByUsername(username) {
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

async function sendMessage(user_data, text) {
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

async function getUser() {
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

function sendCode(phone) {
	return api.call("auth.sendCode", {
		phone_number: phone,
		settings: {
			_: "codeSettings",
		},
	});
}

function signIn({ code, phone, phone_code_hash }) {
	return api.call("auth.signIn", {
		phone_code: code,
		phone_number: phone,
		phone_code_hash: phone_code_hash,
	});
}

function signUp({ phone, phone_code_hash }) {
	return api.call("auth.signUp", {
		phone_number: phone,
		phone_code_hash: phone_code_hash,
		first_name: "MTProto",
		last_name: "Core",
	});
}

function getPassword() {
	return api.call("account.getPassword");
}

function checkPassword({ srp_id, A, M1 }) {
	return api.call("auth.checkPassword", {
		password: {
			_: "inputCheckPasswordSRP",
			srp_id,
			A,
			M1,
		},
	});
}
