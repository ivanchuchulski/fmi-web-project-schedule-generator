// using the javascript immediately-invoked function expression (IIFE)
(function () {
	window.onload = () => loadEvents();

	document.getElementById("list-button").addEventListener("click", listView);
	document.getElementById("grid-button").addEventListener("click", gridView);
	listView();

	let preferenceButtons = document.getElementsByClassName("preferenceButton");

	for (let i = 0; i < preferenceButtons.length; i++) {
		preferenceButtons[i].addEventListener("click", addToPreferences);
	}

	let personalisedScheduleButton = document
		.getElementById("personalised-schedule-button")
		.addEventListener("click", generatePersonalisedSchedule);

	let logoutButton = document
		.getElementById("logout-button")
		.addEventListener("click", logoutRequest);
})();

function loadEvents() {
	const LOAD_SCHEDULE_URL = "php/api.php/loadSchedule";
	const LOAD_SCHEDULE_METHOD = "GET";

	ajaxLoadRequest(LOAD_SCHEDULE_URL, LOAD_SCHEDULE_METHOD);
}

function ajaxLoadRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => ajaxLoadHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(data);
}

function ajaxLoadHandler(xhr) {
	let response = JSON.parse(xhr.responseText);

	if (response.success) {
		console.log("success load schedule");
		drawEvents(response.data);
	} else {
		console.log("error : load schedule");
		displayMessage(
			"грешка : не е започната сесия или сесията е изтелкла(или файлът със събитията не може да бъде зареден)"
		);
	}
}

function drawEvents(events) {
	let eventParent = document.getElementById("event-list");

	let eventList = JSON.parse(events);

	// console.log(JSON.stringify(eventList, null, 4));
	// console.log(eventList);

	Object.keys(eventList).forEach((event) => {
		let theme = eventList[event].theme;
		let presentDate = eventList[event].presentDate;
		let presenterName = eventList[event].presenterName;
		let place = eventList[event].place;

		// console.log("event : ");
		// console.log(theme);
		// console.log(presentDate);
		// console.log(presenterName);
		// console.log(place);

		let eventElement = document.createElement("div");
		let details = document.createElement("div");
		let timeinfo = document.createElement("div");
		let preference = document.createElement("div");
		let willGoButton = document.createElement("button");
		let couldGoButton = document.createElement("button");

		eventElement.className += "event";

		details.className += "details";
		timeinfo.className += "timeinfo";
		preference.className += "preference";
		willGoButton.className += "preferenceButton willAttend";
		couldGoButton.className += "preferenceButton couldAttend";

		details.innerHTML = `<p class="presenter">${presenterName}</p> <p class="theme">${theme}</p>`;
		timeinfo.innerHTML = `<p class="date">${presentDate}</p> <p class="presentationSite">${place}</p>`;

		willGoButton.innerText += "will attend";
		couldGoButton.innerText += "could attend";

		eventParent.appendChild(eventElement);

		eventElement.appendChild(details);
		eventElement.appendChild(timeinfo);
		eventElement.appendChild(preference);

		preference.appendChild(willGoButton);
		preference.appendChild(couldGoButton);

		willGoButton.addEventListener("click", addToPreferences);
		couldGoButton.addEventListener("click", addToPreferences);
	});
}

function addToPreferences() {
	const ACITVE_CLASSNAME = "active";

	// first check if the this button is active
	if (this.classList.contains(ACITVE_CLASSNAME)) {
		removeHightlight(this);
		return;
	}

	let preferenceButtons = this.parentElement.getElementsByClassName("preferenceButton");

	for (let i = 0; i < preferenceButtons.length; i++) {
		if (preferenceButtons[i].classList.contains(ACITVE_CLASSNAME)) {
			removeHightlight(preferenceButtons[i]);
			generatePreferenceDetails(preferenceButtons[i]);
		}
	}

	addHighlight(this);
	generatePreferenceDetails(this);
}

function addHighlight(preferenceButton) {
	preferenceButton.className += " active";
}

function removeHightlight(preferenceButton) {
	preferenceButton.className = preferenceButton.className.replace(" active", "");
}

function generatePersonalisedSchedule() {
	const ACITVE_CLASSNAME = "active";
	let preferences = [];
	let preferenceButtons = document.getElementsByClassName("preferenceButton");

	for (let i = 0; i < preferenceButtons.length; i++) {
		if (preferenceButtons[i].classList.contains(ACITVE_CLASSNAME)) {
			preferences.push(generatePreferenceDetails(preferenceButtons[i]));
		}
	}

	if (preferences.length === 0) {
		displayMessage("не сте избрали никакви събития!");
		// goToPersonalSchedulePage('personalised-schedule.html');
		return;
	}

	console.log("preferences");
	console.log(preferences);

	const LOAD_SCHEDULE_URL = "php/api.php/generatePersonalSchedule";
	const LOAD_SCHEDULE_METHOD = "POST";

	ajaxPersonalScheduleRequest(
		LOAD_SCHEDULE_URL,
		LOAD_SCHEDULE_METHOD,
		`preferencesData=${JSON.stringify(preferences)}`
	);
}

function generatePreferenceDetails(preferenceButton) {
	const PRESENTER_CLASSNAME = "presenter";
	const THEME_CLASSNAME = "theme";

	let event = preferenceButton.parentElement.parentElement;

	let preferenceObj = {
		presenter: event.getElementsByClassName(PRESENTER_CLASSNAME)[0].innerText,
		theme: event.getElementsByClassName(THEME_CLASSNAME)[0].innerText,
		preference: preferenceButton.innerText,
	};

	return preferenceObj;
}

function ajaxPersonalScheduleRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => ajaxPersonalScheduleHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function ajaxPersonalScheduleHandler(xhr) {
	let response = JSON.parse(xhr.responseText);

	if (response.success) {
		console.log("success generate personalised schedule");
		goToPersonalSchedulePage("personalised-schedule.html");
	} else {
		console.log("error : generate personalised schedule");
	}
}

function goToPersonalSchedulePage(pageUrl) {
	window.location = pageUrl;
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

function listView() {
	let elements = document.getElementsByClassName("column");

	for (let i = 0; i < elements.length; i++) {
		elements[i].style.width = "100%";
	}

	updateButtonHighlight();
}

function gridView() {
	let elements = document.getElementsByClassName("column");

	for (let i = 0; i < elements.length; i++) {
		elements[i].style.width = "50%";
	}

	updateButtonHighlight();
}

function updateButtonHighlight() {
	let container = document.getElementById("btnContainer");
	let btns = container.getElementsByClassName("btn");

	for (let i = 0; i < btns.length; i++) {
		btns[i].addEventListener("click", function () {
			let current = document.getElementsByClassName("active");

			current[0].className = current[0].className.replace(" active", "");

			console.log(this);

			this.className += " active";
		});
	}
}

function displayMessage(text) {
	let messageLabel = document.getElementById("messageLabel");

	messageLabel.innerText = text;
}

function logError(object) {
	console.error("errors : ");
	console.error(JSON.stringify(object, null, 4));
}
