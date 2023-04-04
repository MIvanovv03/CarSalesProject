import { LOGIN_TYPE, REGISTER_TYPE } from "./constants.js";

export default ({ email, password, username, type }) => {
	const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const isValidEmail = emailRe.test(email);
	const regEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

	if (email.length === 0 || !isValidEmail) {
		return { validate: false, message: "Невалиден email !" };
	}
	if (type === LOGIN_TYPE) {
		if (password.length < 6) {
			return {
				validate: false,
				message: "Паролата трябва да е поне 6 символа дължина !",
			};
		} else if (regEx.test(password)) {
			return {
				validate: false,
				message:
					"Паролата трябва да има поне една главна буква, една малка буква , една цифра и да е в интервал  6-16 символа !",
			};
		} else {
			return { validate: true, message: "" };
		}
	} else if (type === REGISTER_TYPE) {
		if (password.length < 6) {
			return {
				validate: false,
				message: "Паролата трябва да е поне 6 символа дължина !",
			};
		} else if (username.length < 4) {
			return { validate: false, message: "Невалиден username !" };
		} else if (regEx.test(password)) {
			return {
				validate: false,
				message:
					"Паролата трябва да има поне една главна буква, една малка буква , една цифра и да е в интервал  6-16 символа !",
			};
		} else {
			return { validate: true, message: "" };
		}
	} else {
		return { validate: false, message: "Invalid type of calling function" };
	}
};
