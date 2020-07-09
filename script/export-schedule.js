// using the javascript immediately-invoked function expression (IIFE)
(function () {
	let schedulePageButton = document
		.getElementById("schedule-page-button")
		.addEventListener("click", goToSchedulePage.bind(null, "schedule.html"));

	let personalisedScheduleButton = document.getElementById("personalised-schedule-button");
	personalisedScheduleButton.addEventListener("click", () => {
		window.location = "personal-schedule.html";
	});

	let exportScheduleButton = document.getElementById("export-schedule");

	exportScheduleButton.addEventListener("click", () => {
		window.location = "export-schedule.html";
	});
	addHighlight(exportScheduleButton);

	let logoutButton = document
		.getElementById("logout-button")
        .addEventListener("click", logoutRequest);
        
    let exportScheduleOption = document.getElementById('export-pdf').addEventListener("click", createLinkAndDownloadPdf);
})();

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

function createLinkAndDownloadPdf() {
	const link = document.createElement("a");
	link.href = "php/api.php/exportScheduleInPdf";
	link.download = "";

	link.dispatchEvent(new MouseEvent("click"))
}