'use strict';
(function () {
	addNavbarHandlers();
})();

function addNavbarHandlers() {
	document.getElementById("logout-button").addEventListener("click", logout);
}

function logout() {
	const LOGOUT_URL = "php/api.php/logout";
	const LOGOUT_METHOD = "POST";

	logoutRequest(LOGOUT_URL, LOGOUT_METHOD);
}

function logoutRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => logoutHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function logoutHandler(xhr) {
	let response = JSON.parse(xhr.responseText);

	if (response.success) {
		console.log("success : logout request");
		goToLoginPage("index.html");
	} else {
		console.log("error : logout request");
	}
}

function goToLoginPage(loginPageUrl) {
	window.location = loginPageUrl;
}
