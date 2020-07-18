// using the javascript immediately-invoked function expression (IIFE)
(function () {
	navigationButtonHandlers();
})();

function navigationButtonHandlers() {
	let schedulePageButton = document.getElementById("schedule-page-button");
	schedulePageButton.addEventListener("click", goToSchedulePage.bind(null, "schedule.html"));

	let personalSchedule = document
		.getElementById("personalised-schedule-button")
		.addEventListener("click", () => {
			window.location = "personal-schedule.html";
		});

	let exportScheduleButton = document
		.getElementById("export-schedule")
		.addEventListener("click", () => {
			window.location = "export-schedule.html";
		});

	let statisticsButton = document.getElementById("view-statistics");
	statisticsButton.addEventListener("click", () => {
		window.location = "statistics.html";
	});
	addHighlight(statisticsButton);

	let logoutButton = document
		.getElementById("logout-button")
		.addEventListener("click", logoutRequest);
}


function addHighlight(preferenceButton) {
	preferenceButton.className += " active";
}

function goToSchedulePage(schedulePageUrl) {
	window.location = schedulePageUrl;
}

function logoutRequest() {
	const LOGOUT_URL = "php/api.php/logout";
	const LOGOUT_METHOD = "POST";

	ajaxLogoutRequest(LOGOUT_URL, LOGOUT_METHOD);
}

function ajaxLogoutRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => ajaxLogoutHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function ajaxLogoutHandler(xhr) {
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