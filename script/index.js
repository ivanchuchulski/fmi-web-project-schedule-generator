'use strict';
(function () {
	let registerButton = document.getElementById("register-button");
	let enterButton = document.getElementById("enter-button");

	registerButton.addEventListener("click", register);
	enterButton.addEventListener("click", login);
})();

function register(clickEvent) {
	try {
		clickEvent.preventDefault();

		let formData = {};
		formData["emailRegister"] = validateRegistrationEmail("register-email");
		formData["usernameRegister"] = validateRegistrationUsername("register-username");
		formData["passwordRegister"] = validateRegistrationPassword("register-password");

		let passwordRepeatedRegister = getRegistrationPasswordRepeated("register-password-repeated");
		checkIfPasswordsMatch(formData["passwordRegister"], passwordRepeatedRegister);

		const REGISTER_METHOD = "POST";
        const REGISTER_REQUEST_URL = "php/api.php/registration";

		sendRegistrationRequest(REGISTER_REQUEST_URL, REGISTER_METHOD, `formData=${JSON.stringify(formData)}`);
	} catch (exception) {
		displayRegistrationErrorMessage(exception);
	}
}

function login(clickEvent) {
	try {
		clickEvent.preventDefault();

		let formData = {};
		formData["usernameLogin"] = validateLoginUsername("login-username");
		formData["passwordLogin"] = validateLoginPassword("login-password");

		const LOGIN_METHOD = "POST";
		const LOGIN_REQUEST_URL = "php/api.php/login";

		sendLoginRequest(LOGIN_REQUEST_URL, LOGIN_METHOD, `formData=${JSON.stringify(formData)}`);
	} catch (exception) {
		displayLoginError(exception);
	}
}

function validateRegistrationEmail(elementId) {
	const EMAIL_LENGTH_LOWER_LIMIT = 3;
	const EMAIL_LENGTH_UPPER_LIMIT = 50;
	const EMAIL_PATTERN = `^[A-Za-z0-9_-]{${EMAIL_LENGTH_LOWER_LIMIT},${EMAIL_LENGTH_UPPER_LIMIT}}@[a-z]+\.[a-z]+$`;
	const EMAIL_REGEX = new RegExp(EMAIL_PATTERN);

	let email = document.getElementById(`${elementId}`).value;

	if (email === "") {
		throw "грешка: имейлът е задължително поле";
	}

	if (!email.match(EMAIL_REGEX)) {
		throw "грешка: имейлът трябва да е във формат example0123-_@domain.com";
	}

	return formatInput(email);
}

function validateRegistrationUsername(elementId) {
	const USERNAME_LENGTH_LOWER_LIMIT = 3;
	const USERNAME_LENGTH_UPPER_LIMIT = 50;
	const USERNAME_PATTERN = `^[A-Za-z0-9_-]{${USERNAME_LENGTH_LOWER_LIMIT},${USERNAME_LENGTH_UPPER_LIMIT}}$`;
	const USERNAME_REGEX = new RegExp(USERNAME_PATTERN);

	let username = document.getElementById(`${elementId}`).value;

	if (username === "") {
		throw "грешка: потребителското име е задължително поле";
	}

	if (!username.match(USERNAME_REGEX)) {
		throw `грешка: потребителското име трябва да съдържа само букви, цифри, _ и -`;
	}

	return formatInput(username);
}

function validateRegistrationPassword(elementId) {
	const PASSWORD_LOWER_LIMIT = 6;
	const PASSWORD_UPPER_LIMIT = 20;
	const PASSWORD_PATTERN = `^[A-Za-z0-9]{${PASSWORD_LOWER_LIMIT},${PASSWORD_UPPER_LIMIT}}$`;
	const PASSWORD_REGEX = new RegExp(PASSWORD_PATTERN);

	let password = document.getElementById(`${elementId}`).value;

	if (password === "") {
		throw `грешка: паролата е задължително поле`;
	}

	if (!containsUppercaseLetter(password)) {
		throw `грешка: паролата трябва да съдържа поне една главна буква`;
	}

	if (!containsDigit(password)) {
		throw `грешка: паролата трябва да съдържа поне една цифра`;
	}

	if (!password.match(PASSWORD_REGEX)) {
		throw `грешка: паролата трябва да има дължина между ${PASSWORD_LOWER_LIMIT} и ${PASSWORD_UPPER_LIMIT} символа`;
	}

	return formatInput(password);
}

function getRegistrationPasswordRepeated(elementId) {
	let passwordRepeated = document.getElementById(`${elementId}`).value;

	if (passwordRepeated === "") {
		throw `грешка: повторената парола е задължително поле`;
	}

	return formatInput(passwordRepeated);
}

function checkIfPasswordsMatch(password, passwordRepeated) {
	if (password !== passwordRepeated) {
		throw "грешка: паролите трябва да съвпадат";
	}
}

function validateLoginUsername(elementId) {
	let username = document.getElementById(`${elementId}`).value;

	if (username === "") {
		throw "грешка: потребителското име е задължително";
	}

	return formatInput(username);
}

function validateLoginPassword(elementId) {
	let password = document.getElementById(`${elementId}`).value;

	if (password === "") {
		throw "грешка: паролата е задължително поле";
	}

	return formatInput(password);
}

function formatInput(formField) {
	formField = trimTrailingWhitespace(formField);
	formField = removeSlashes(formField);
	formField = removeHTMLSpecialCharacters(formField);

	return formField;
}

function containsUppercaseLetter(str) {
	return str.match(/[A-Z]/);
}

function containsDigit(str) {
	return str.match(/[0-9]/);
}

function trimTrailingWhitespace(str) {
	return str.trim();
}

function removeSlashes(str) {
	return str.replace(/\//g, "");
}

function removeHTMLSpecialCharacters(str) {
	const HTML_SPECIAL_CHARACTERS_MAP = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#039;",
	};

	return str.replace(/[&<>"']/g, symbol => HTML_SPECIAL_CHARACTERS_MAP[symbol]);
}

function sendRegistrationRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => registrationRequestHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function registrationRequestHandler(xhr) {
	const OK_RESPONSE_CODE = 200;

	let responseStatusCode = xhr.status;

	if (responseStatusCode === OK_RESPONSE_CODE && JSON.parse(xhr.responseText).success) {
		displayRegistrationSuccessMessage("успешна регистрация!");

		let registrationForm = document.getElementById("registration-form");
		registrationForm.reset();
	} else {
		displayRegistrationErrorMessage('неуспешна регистация!');
	}
}

function sendLoginRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => loginRequestHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function loginRequestHandler(xhr) {
	const OK_RESPONSE_CODE = 200;

	let responseStatusCode = xhr.status;

	if (responseStatusCode === OK_RESPONSE_CODE && JSON.parse(xhr.responseText).success) {
		displaySchedulePage("schedule.html");
	} else {
		displayLoginError('неуспешено влизане в системата');
	}
}

function displaySchedulePage(pageURL) {
	window.location = pageURL;
}

function displayRegistrationSuccessMessage(message) {
	let errorLabel = document.getElementById("registration-message");

	errorLabel.style.color = "green";
	errorLabel.innerHTML = message;
}

function displayRegistrationErrorMessage(message) {
	let errorLabel = document.getElementById("registration-message");

	errorLabel.style.color = "red";
	errorLabel.innerHTML = message;
}

function displayLoginError(message) {
	let errorLabel = document.getElementById("login-message");

	errorLabel.innerHTML = message;
}

function printObject(object) {
	console.log(JSON.stringify(object, null, 4));
}
