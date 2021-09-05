'use strict';
(function () {
	addNavbarHandlers();
	addActionButtonsHandlers();
	loadEvents();
})();

function addNavbarHandlers() {
	const NAVBAR_BUTTONS_HANDLERS = {
		"schedule-page-button": () => window.location = "schedule.html",
		"personalised-schedule-button": () => window.location = "personal-schedule.html",
		"export-schedule": () => window.location = "personal-schedule.html",
		"view-statistics": () => window.location = "statistics.html",
		"logout-button": logoutRequest
	};

	for (let buttonID in NAVBAR_BUTTONS_HANDLERS) {
		document.getElementById(buttonID)
				.addEventListener("click", NAVBAR_BUTTONS_HANDLERS[buttonID]);
	}

	addHighlight(document.getElementById("schedule-page-button"));
}

function addActionButtonsHandlers() {
	const ACTION_BUTTONS_HANDLERS = {
		"make-personal": generatePersonalisedSchedule,
		"apply-filter" : applyFiltersToEvents,
		"reset-filter" : removeFilters
	};

	for (let actionButtonID in ACTION_BUTTONS_HANDLERS) {
		document.getElementById(actionButtonID)
				.addEventListener("click", ACTION_BUTTONS_HANDLERS[actionButtonID]);
	}
}

function loadEvents() {
	const LOAD_SCHEDULE_URL = "php/api.php/loadSchedule";
	const LOAD_SCHEDULE_METHOD = "GET";

	loadEventsRequest(LOAD_SCHEDULE_URL, LOAD_SCHEDULE_METHOD);
}


function loadEventsRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => ajaxLoadHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/presentations_data");
	xhr.send(data);
}

function ajaxLoadHandler(xhr) {
	let response = JSON.parse(xhr.responseText);

	if (response.success) {
		console.log("success load schedule");
		drawEvents(response);
	} else {
		console.log("error : load schedule");
		displayMessage(
			"грешка : не е започната сесия или сесията е изтелкла(или файлът със събитията не може да бъде зареден)"
		);
	}
}

function drawEvents(responseText) {
	let username = responseText.username;
	document.getElementById("username").innerText += ", " + username + "!";

	let eventList = JSON.parse(responseText.data);
	let eventParent = document.getElementById("event-list");

	console.log(eventList);

	for (let event of eventList) {
		let {theme, presenterName, place, facultyNumber, groupNumber, dayNumber, presentDate, numberOfPreferences
		,preferenceType } = event;

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
		let presentationSiteParagraph = document.createElement("p");
		let numberOfPreferencesParagraph = document.createElement("p");
		let placeLink = document.createElement("a");
		let placeMessageSpan = document.createElement("span");
		let placeAddressSpan = document.createElement("span");

		let preference = document.createElement("section");
		let willGoButton = document.createElement("button");
		let couldGoButton = document.createElement("button");

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
		dateParagraph.innerText += `${eventDateFormatted}, Ден ${dayNumber}`;

		numberOfPreferencesParagraph.innerText += `Проявяващи интерес : ${numberOfPreferences}`

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
		timeinfo.appendChild(numberOfPreferencesParagraph);
		timeinfo.appendChild(presentationSiteParagraph);

		// preference section
		preference.appendChild(willGoButton);
		preference.appendChild(couldGoButton);

		// event section
		eventElement.appendChild(details);
		eventElement.appendChild(timeinfo);
		eventElement.appendChild(preference);

		eventParent.appendChild(eventElement);

		// adding event listeners
		if (preferenceType === "willAttend") {
			addHighlight(willGoButton);
			couldGoButton.style.display = "none";
		}
		else if (preferenceType === "couldAttend") {
			addHighlight(couldGoButton);
			willGoButton.style.display = "none";
		} else {
			// show both buttons
			willGoButton.addEventListener("click", addToPreferences);
			couldGoButton.addEventListener("click", addToPreferences);
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

	let filterByDay = daySelectElement.options[daySelectElement.selectedIndex].value;
	let filterByGroup = groupSelectElement.options[groupSelectElement.selectedIndex].value;

	let events = document.getElementsByClassName("event");

	displayAllEvents();

	if (filterByDay) {
		filterEventsByDay(events, filterByDay.slice(-1));
	}

	if (filterByGroup) {
		filterEventsByGroup(events, filterByGroup.slice(-1));
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
		// let eventDay = event.getElementsByClassName("dayNumber")[0].innerText.split(" ")[1];
		let eventDay = event.getElementsByClassName("date")[0].innerText.slice(-1);

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

function showEvent(event) {
	event.style.display = "flex";
}

function hideEvent(event) {
	event.style.display = "none";
}

function removeFilters() {
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

	// first check if the this button is active
	if (this.classList.contains(ACTIVE_CLASSNAME)) {
		removeHighlight(this);
		return;
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

function generatePersonalisedSchedule() {
	const ACTIVE_CLASSNAME = "active";
	let preferences = [];
	let preferenceButtons = document.getElementsByClassName("preferenceButton");

	for (let i = 0; i < preferenceButtons.length; i++) {
		if (preferenceButtons[i].classList.contains(ACTIVE_CLASSNAME)) {
			preferences.push(generatePreferenceDetails(preferenceButtons[i]));
		}
	}

	if (preferences.length === 0) {
		displayMessage("грешка : не сте избрали никакви събития!");
		// window.location = "personal-schedule.html";
		return;
	}

	// console.log("preferences");
	// console.log(preferences);

	const LOAD_SCHEDULE_URL = "php/api.php/generatePersonalSchedule";
	const LOAD_SCHEDULE_METHOD = "POST";

	ajaxPersonalScheduleRequest(
		LOAD_SCHEDULE_URL,
		LOAD_SCHEDULE_METHOD,
		`preferencesData=${JSON.stringify(preferences)}`
	);
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
		goToPersonalSchedulePage("personal-schedule.html");
	} else {
		displayMessage("грешка : невъзможност за генеране на персонален график");
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

function goToSchedulePage(schedulePageUrl) {
	window.location = schedulePageUrl;
}

function displayMessage(text) {
	let messageLabel = document.getElementById("message-label");

	messageLabel.innerText = text;
}

function logError(object) {
	console.error("errors : ");
	console.error(JSON.stringify(object, null, 4));
}
