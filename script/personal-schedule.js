'use strict';
(function () {
	addNavbarHandlers();
	addActionButtonsHandlers();
	loadPersonalEvents();
})();

function addNavbarHandlers() {
	const NAVBAR_BUTTONS_HANDLERS = {
		"schedule-page-button": () => window.location = "schedule.html",
		"personalised-schedule-button": () => window.location = "personal-schedule.html",
		"export-schedule": () => window.location = "export-schedule.html",
		"view-statistics": () => window.location = "statistics.html",
		"logout-button": logout
	};

	for (let buttonID in NAVBAR_BUTTONS_HANDLERS) {
		document.getElementById(buttonID)
			.addEventListener("click", NAVBAR_BUTTONS_HANDLERS[buttonID]);
	}

	addHighlight(document.getElementById("personalised-schedule-button"));
}

function addActionButtonsHandlers() {
	const ACTION_BUTTONS_HANDLERS = {
		"apply-changes": updatePersonalSchedule,
		"apply-filter" : applyFiltersToEvents,
		"reset-filter" : removeFilters
	};

	for (let actionButtonID in ACTION_BUTTONS_HANDLERS) {
		document.getElementById(actionButtonID)
			.addEventListener("click", ACTION_BUTTONS_HANDLERS[actionButtonID]);
	}
}

function loadPersonalEvents() {
	const PERSONAL_SCHEDULE_URL = "php/api.php/loadPersonalSchedule";
	const PERSONAL_SCHEDULE_METHOD = "GET";

	loadPersonalScheduleRequest(PERSONAL_SCHEDULE_URL, PERSONAL_SCHEDULE_METHOD);
}

function loadPersonalScheduleRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => loadPersonalScheduleHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(data);
}

function loadPersonalScheduleHandler(xhr) {
	let response = JSON.parse(xhr.responseText);

	if (response.success) {
		drawPersonalEvents(response);
	} else {
		displayMessage(
			"грешка : не е започната сесия или сесията е изтелкла(или персоналните събития не може да бъдат заредени)"
		);
	}
}

function drawPersonalEvents(responseText) {
	let username = responseText.username;
	document.getElementById("username").innerText += " " + username + "!";

	let preferencesList = JSON.parse(responseText.data);

	if (preferencesList.length === 0) {
		displayMessage("Нямате избрани презентации!");

		document.getElementById("apply-changes").style.display = "none";
		document.getElementById("filters").style.display = "none";

		return;
	}
	console.log(preferencesList);

	let eventParent = document.getElementById("personal-events");

	for (let event of preferencesList) {
		let {theme, presenterName, place, facultyNumber, groupNumber, dayNumber, presentDate, prefType} = event;

		let date = new Date(presentDate);
		let eventTime = date.toLocaleTimeString().split(":").splice(0, 2).join(":");
		let yearMonthDay = date.toDateString().split(" ").splice(1, 3).join(" ");

		let eventDateFormatted = eventTime + ", " + yearMonthDay;

		let eventElement = document.createElement("section");

		let details = document.createElement("section");
		let themeParagraph = document.createElement("p")
		let presenterParagraph = document.createElement("p")
		let groupNumberParagraph = document.createElement("p")

		let timeinfo = document.createElement("section");
		let dateParagraph = document.createElement("p");
		let dayParagraph = document.createElement("p");
		let presentationSiteParagraph = document.createElement("p");
		let placeLink = document.createElement("a");
		let placeMessageSpan = document.createElement("span");
		let placeAddressSpan = document.createElement("span");

		let preference = document.createElement("section");
		let willGoButton = document.createElement("button");
		let couldGoButton = document.createElement("button");
		let removeButton = document.createElement("button");

		eventElement.className += "event";

		// details section
		details.className += "details";

		themeParagraph.className += "theme";
		themeParagraph.innerText += theme;

		presenterParagraph.className += "presenter";
		presenterParagraph.innerText += `${presenterName}, ${facultyNumber}`;

		groupNumberParagraph.className += "groupNumber";
		groupNumberParagraph.innerText += `Група ${groupNumber}`;

		// timeinfo section
		timeinfo.className += "timeinfo";

		dateParagraph.className += "date";
		dateParagraph.innerText += eventDateFormatted;

		dayParagraph.className += "dayNumber";
		dayParagraph.innerText += `Ден ${dayNumber}`;

		presentationSiteParagraph.className += "presentationSite";

		placeLink.href = place;
		placeLink.target = "_blank";

		placeMessageSpan.className = "placeMessage";
		placeMessageSpan.innerText += "Място на провеждане";

		placeAddressSpan.className = "placeAddress";
		placeAddressSpan.innerText += place

		// preferences section
		preference.className += "preference";

		willGoButton.className += "preferenceButton willAttend";
		willGoButton.innerText += "ще отида";

		couldGoButton.className += "preferenceButton couldAttend";
		couldGoButton.innerText += "може би ще отида";

		removeButton.className += "preferenceButton cancelAttend";
		removeButton.innerText += "премахни събитието";

		// appending the elements in the DOM
		// details section
		details.appendChild(themeParagraph);
		details.appendChild(presenterParagraph);
		details.appendChild(groupNumberParagraph);

		// timeinfo section
		presentationSiteParagraph.appendChild(placeLink);
		placeLink.appendChild(placeMessageSpan);
		placeLink.appendChild(placeAddressSpan);

		timeinfo.appendChild(dateParagraph);
		timeinfo.appendChild(dayParagraph);
		timeinfo.appendChild(presentationSiteParagraph);

		// preference section
		preference.appendChild(willGoButton);
		preference.appendChild(couldGoButton);
		preference.appendChild(removeButton);

		// event section
		eventElement.appendChild(details);
		eventElement.appendChild(timeinfo);
		eventElement.appendChild(preference);

		eventParent.appendChild(eventElement);

		// adding event listeners
		willGoButton.addEventListener("click", addToPreferences);
		couldGoButton.addEventListener("click", addToPreferences);
		removeButton.addEventListener("click", addToPreferences);

		// highlighting preference button
		if (prefType === "willAttend") {
			addHighlight(willGoButton);
		}
		else {
			addHighlight(couldGoButton);
		}

		// by default hide the place address link
		timeinfo.getElementsByClassName('placeAddress')[0].style.display = "none";

		timeinfo.addEventListener("mouseover", showAddressOnHover);
		timeinfo.addEventListener("mouseleave", showMessageOnLeave);
	}
}

function showAddressOnHover() {
	let placeMessageElement = this.getElementsByClassName('placeMessage')[0];
	let placeAddressElement = this.getElementsByClassName("placeAddress")[0];

	placeMessageElement.style.display = "none";
	placeAddressElement.style.display = "inline";
}

function showMessageOnLeave() {
	let placeMessageElement = this.getElementsByClassName('placeMessage')[0];
	let placeAddressElement = this.getElementsByClassName("placeAddress")[0];

	placeMessageElement.style.display = "inline";
	placeAddressElement.style.display = "none";
}

function applyFiltersToEvents() {
	let daySelectElement = document.getElementById("filter-by-day");
	let groupSelectElement = document.getElementById("filter-by-group");
	let preferenceSelectElement = document.getElementById("filter-by-preference");

	let filterByDay = daySelectElement.options[daySelectElement.selectedIndex].value;
	let filterByGroup = groupSelectElement.options[groupSelectElement.selectedIndex].value;
	let filterByPreference =
		preferenceSelectElement.options[preferenceSelectElement.selectedIndex].value;

	let events = document.getElementsByClassName("event");

	displayAllEvents();

	if (filterByDay) {
		filterEventsByDay(events, filterByDay.slice(-1));
	}

	if (filterByGroup) {
		filterEventsByGroup(events, filterByGroup.slice(-1));
	}

	if (filterByPreference) {
		filterEventsByPreference(events, filterByPreference);
	}

	let allEventsAreHidden = true;
	for (let event of events) {
		if (event.style.display !== "none") {
			allEventsAreHidden = false;
			break;
		}
	}

	if (allEventsAreHidden) {
		displayMessage("няма събития, които да отговарят на критериите Ви");
	} else {
		clearMessage();
	}
}

function displayAllEvents() {
	let events = document.getElementsByClassName("event");

	for (let event of events) {
		showEvent(event);
	}
}

function filterEventsByDay(events, dayFilter) {
	for (let event of events) {
		let eventDay = event.getElementsByClassName("dayNumber")[0].innerText.split(" ")[1];

		if (eventDay !== dayFilter) {
			hideEvent(event);
		}
	}
}

function filterEventsByGroup(events, groupFilter) {
	for (let event of events) {
		let eventGroup = event.getElementsByClassName("groupNumber")[0].innerText.split(" ")[1];

		if (eventGroup !== groupFilter) {
			hideEvent(event);
		}
	}
}

function filterEventsByPreference(events, preferenceFilter) {
	for (let index = 0; index < events.length; index++) {
		const event = events[index];
		let activePreferenceButton = event.getElementsByClassName("active")[0];
		let buttonPreference = activePreferenceButton.className.split(" ")[1];

		if (buttonPreference !== preferenceFilter) {
			hideEvent(event);
		}
	}
}

function showEvent(event) {
	event.style.display = "flex";
}

function hideEvent(event) {
	event.style.display = "none";
}

function removeFilters() {
	clearMessage();
	displayAllEvents();
	removeSelectedFilters();
}

function removeSelectedFilters() {
	let daySelectElement = document.getElementById("filter-by-day");
	let groupSelectElement = document.getElementById("filter-by-group");

	daySelectElement.selectedIndex = 0;
	groupSelectElement.selectedIndex = 0;
}



function addToPreferences() {
	const ACTIVE_CLASSNAME = "active";
	const CANCEL_CLASSNAME = "cancelAttend";

	// first check if the this button is active
	if (this.classList.contains(ACTIVE_CLASSNAME) && !this.classList.contains(CANCEL_CLASSNAME)) {
		removeHighlight(this);

		let preferenceButtons = this.parentElement.getElementsByClassName("preferenceButton");
		for (let i = 0; i < preferenceButtons.length; i++) {
			if (preferenceButtons[i].classList.contains(CANCEL_CLASSNAME)) {
				addHighlight(preferenceButtons[i]);
				return;
			}
		}
	}

	if (this.classList.contains(ACTIVE_CLASSNAME)) {
		removeHighlight(this);
	}

	let preferenceButtons = this.parentElement.getElementsByClassName("preferenceButton");

	for (let i = 0; i < preferenceButtons.length; i++) {
		if (preferenceButtons[i].classList.contains(ACTIVE_CLASSNAME)) {
			removeHighlight(preferenceButtons[i]);
		}
	}

	addHighlight(this);
}

function addHighlight(preferenceButton) {
	preferenceButton.className += " active";
}

function removeHighlight(preferenceButton) {
	preferenceButton.className = preferenceButton.className.replace(" active", "");
}

function updatePersonalSchedule() {
	const ACTIVE_CLASSNAME = "active";
	let preferences = [];
	let preferenceButtons = document.getElementsByClassName("preferenceButton");

	for (let i = 0; i < preferenceButtons.length; i++) {
		if (preferenceButtons[i].classList.contains(ACTIVE_CLASSNAME)) {
			preferences.push(generatePreferenceDetails(preferenceButtons[i]));
		}
	}

	if (preferences.length === 0) {
		displayMessage("грешка : моля изберете действие за събитието");
		return;
	}

	const UPDATE_SCHEDULE_URL = "php/api.php/updatePersonalSchedule";
	const UPDATE_SCHEDULE_METHOD = "POST";

	updatePersonalScheduleRequest(
		UPDATE_SCHEDULE_URL,
		UPDATE_SCHEDULE_METHOD,
		`preferencesData=${JSON.stringify(preferences)}`
	);
}

function updatePersonalScheduleRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => updatePersonalScheduleHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function updatePersonalScheduleHandler(xhr) {
	let response = JSON.parse(xhr.responseText);

	if (response.success) {
		window.location = "personal-schedule.html";
	} else {
		displayMessage("грешка : невъзможност за обновяваве на персонален график");
	}
}

function generatePreferenceDetails(preferenceButton) {
	const THEME_CLASSNAME = "theme";
	const PREFERENCE_CLASSNAME_INDEX = 1;

	let event = preferenceButton.parentElement.parentElement;

	return {
		presentationTheme: event.getElementsByClassName(THEME_CLASSNAME)[0].innerText,
		preferenceType: preferenceButton.classList[PREFERENCE_CLASSNAME_INDEX],
	};
}

function logout() {
	const LOGOUT_URL = "php/api.php/logout";
	const LOGOUT_METHOD = "POST";

	logoutRequest(LOGOUT_URL, LOGOUT_METHOD);
}

function logoutRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => logoutRequestHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function logoutRequestHandler(xhr) {
	let response = JSON.parse(xhr.responseText);

	if (response.success) {
		window.location = "index.html";
	} else {
		displayMessage("грешка при опит за излизане от системата");
	}
}

function displayMessage(text) {
	let messageLabel = document.getElementById("message-label");

	messageLabel.innerText = text;
}

function clearMessage() {
	let messageLabel = document.getElementById("message-label");

	messageLabel.innerText = "";
}
