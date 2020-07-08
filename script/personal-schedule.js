// using the javascript immediately-invoked function expression (IIFE)
(function () {
    window.onload = () => loadPersonalEvents();

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

function loadPersonalEvents() {
    const PERSONAL_SCHEDULE_URL = "php/api.php/loadPersonalSchedule";
    const PERSONAL_SCHEDULE_METHOD = "GET";

    ajaxLoadPersonalScheduleRequest(PERSONAL_SCHEDULE_URL, PERSONAL_SCHEDULE_METHOD);
}

function ajaxLoadPersonalScheduleRequest(url, method, data) {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener("load", () => ajaxLoadPersonalScheduleHandler(xhr));

    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(data);
}

function ajaxLoadPersonalScheduleHandler(xhr) {
    let response = JSON.parse(xhr.responseText);

    if (response.success) {
        console.log("success load personal schedule");
        drawPersonalEvents(response.data);
    } else {
        console.log("error : load schedule");
        displayMessage(
            "грешка : не е започната сесия или сесията е изтелкла(или файлът със събитията не може да бъде зареден)"
        );
    }
}

function drawPersonalEvents(events) {
    let eventParent = document.getElementById("personal-events");

    let eventList = JSON.parse(events);

    console.log(JSON.stringify(eventList, null, 4));
    console.log(eventList);

    exit;

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
    });
}