// using the javascript immediately-invoked function expression (IIFE)
(function () {
	window.onload = () => loadPersonalEvents();

	let schedulePageButton = document
		.getElementById("schedule-page-button")
		.addEventListener("click", goToSchedulePage.bind(null, "schedule.html"));

	let personalisedScheduleButton = document.getElementById("personalised-schedule-button");
	personalisedScheduleButton.addEventListener("click", () => {
		window.location = "personal-schedule.html";
	});
	addHighlight(personalisedScheduleButton);

	let exportScheduleButton = document
		.getElementById("export-schedule")
		.addEventListener("click", () => {
			window.location = "export-schedule.html";
	});

	let logoutButton = document
		.getElementById("logout-button")
		.addEventListener("click", logoutRequest);

	let applyChangesButton = document
		.getElementById("apply-changes")
		.addEventListener("click", updatePersonalSchedule);
})();

function loadPersonalEvents() {
	const PERSONAL_SCHEDULE_URL = "php/api.php/loadPersonalSchedule";
	const PERSONAL_SCHEDULE_METHOD = "GET";

	ajaxLoadPersonalScheduleRequest(PERSONAL_SCHEDULE_URL, PERSONAL_SCHEDULE_METHOD);
}

function ajaxLoadPersonalScheduleRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => ajaxLoadPersonalScheduleHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/presentations_data");
	xhr.send(data);
}

function ajaxLoadPersonalScheduleHandler(xhr) {
	let response = JSON.parse(xhr.responseText);

	if (response.success) {
		drawPersonalEvents(response);
	} else {
		displayMessage(
			"грешка : не е започната сесия или сесията е изтелкла(или персоналните събития не може да бъдат заредени)"
		);
	}
}

function drawPersonalEvents(response) {
	let eventParent = document.getElementById("personal-events");

	let username = response.username;
	document.getElementById("username").innerText += " " + username + "!";

	let events = response.data;

	if (events.length === 0) {
		displayMessage("Нямате избрани презентации!");
		let applyChangesButton = document.getElementById("apply-changes");
		applyChangesButton.style.display = "none";
	} else {
		Object.keys(events).forEach((event) => {
			let theme = events[event].theme;
			let presentDate = events[event].presentDate;
			let presenterName = events[event].presenterName;
			let place = events[event].place;
			let preferenceType = events[event].preferenceType;

			let facultyNumber = events[event].facultyNumber;
			let groupNumber = events[event].groupNumber;
			let dayNumber = events[event].dayNumber;


			let eventElement = document.createElement("div");

			let details = document.createElement("div");
			let timeinfo = document.createElement("div");
			let preference = document.createElement("div");

			let willGoButton = document.createElement("button");
			let couldGoButton = document.createElement("button");
			let removeButton = document.createElement("button");

			eventElement.className += "event";
			details.className += "details";
			timeinfo.className += "timeinfo";
			preference.className += "preference";

			willGoButton.className += "preferenceButton willAttend";
			couldGoButton.className += "preferenceButton couldAttend";
			removeButton.className += "preferenceButton cancelAttend";

			details.innerHTML = `<p class="theme">${theme}</p>
			<p class="presenter">${presenterName}, ${facultyNumber}</p>
			<p class="group-number"> Група ${groupNumber}</p>`;
			timeinfo.innerHTML = `<p class="date">${presentDate}</p>
			<p class="day-number">Ден ${dayNumber}</p>
			<p class="presentationSite">${place}</p>`;

			willGoButton.innerText += "ще отида";
			couldGoButton.innerText += "може би ще отида";
			removeButton.innerText += "премахни събитието";

			eventParent.appendChild(eventElement);

			eventElement.appendChild(details);
			eventElement.appendChild(timeinfo);
			eventElement.appendChild(preference);

			preference.appendChild(willGoButton);
			preference.appendChild(couldGoButton);
			preference.appendChild(removeButton);

			// set the button highlight preference
			if (preferenceType === "willAttend") {
				addHighlight(willGoButton);
			} else {
				addHighlight(couldGoButton);
			}

			willGoButton.addEventListener("click", addToPreferences);
			couldGoButton.addEventListener("click", addToPreferences);
			removeButton.addEventListener("click", addToPreferences);
		});
	}
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

function updatePersonalSchedule() {
	const ACITVE_CLASSNAME = "active";
	let preferences = [];
	let preferenceButtons = document.getElementsByClassName("preferenceButton");

	for (let i = 0; i < preferenceButtons.length; i++) {
		if (preferenceButtons[i].classList.contains(ACITVE_CLASSNAME)) {
			preferences.push(generatePreferenceDetails(preferenceButtons[i]));
		}
	}

	if (preferences.length === 0) {
		displayMessage("грешка : моля изберете действие за събитието");
		return;
	}

	// console.log("preferences");
	// console.log(preferences);

	const UPDATE_SCHEDULE_URL = "php/api.php/updatePersonalSchedule";
	const UPDATE_SCHEDULE_METHOD = "POST";

	ajaxUpdatePersonalScheduleRequest(
		UPDATE_SCHEDULE_URL,
		UPDATE_SCHEDULE_METHOD,
		`preferencesData=${JSON.stringify(preferences)}`
	);
}

function ajaxUpdatePersonalScheduleRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => ajaxUpdatePersonalScheduleHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function ajaxUpdatePersonalScheduleHandler(xhr) {
	let response = JSON.parse(xhr.responseText);

	if (response.success) {
		console.log("success update personalised schedule");
		goToPersonalSchedulePage("personal-schedule.html");
	} else {
		console.log("error : generate personalised schedule");
		displayMessage("грешка : невъзможност за обновяваве на персонален график");
	}
}

function generatePreferenceDetails(preferenceButton) {
	const THEME_CLASSNAME = "theme";
	const PREFERENCE_CLASSNAME_INDEX = 1;

	let event = preferenceButton.parentElement.parentElement;

	let preferenceObj = {
		presentationTheme: event.getElementsByClassName(THEME_CLASSNAME)[0].innerText,
		preferenceType: preferenceButton.classList[PREFERENCE_CLASSNAME_INDEX],
	};

	return preferenceObj;
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

function goToSchedulePage(schedulePageUrl) {
	window.location = schedulePageUrl;
}

function goToPersonalSchedulePage(schedulePageUrl) {
	window.location = schedulePageUrl;
}

function goToLoginPage(loginPageUrl) {
	window.location = loginPageUrl;
}

function displayMessage(text) {
	let messageLabel = document.getElementById("messageLabel");

	messageLabel.innerText = text;
}
