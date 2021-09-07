'use strict';
(function () {
    addNavbarHandlers();
    loadStatistics();
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

    addHighlight(document.getElementById("view-statistics"));
}

function loadStatistics() {
    const LOAD_SCHEDULE_METHOD = "GET";
    const LOAD_SCHEDULE_URL = "php/api.php/statistics";

    loadStatisticsRequest(LOAD_SCHEDULE_URL, LOAD_SCHEDULE_METHOD);
}

function loadStatisticsRequest(url, method, data) {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener("load", () => loadStatisticsHandler(xhr));

    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(data);
}

function loadStatisticsHandler(xhr) {
    let responseText = JSON.parse(xhr.responseText);

    if (responseText.success) {
        drawStatistics(responseText);
    } else {
        displayMessage("грешка : статистиката не може да бъде заредена");
    }
}

function drawStatistics(responseText) {
    const TEXT_CENTER_CLASSNAME = "text-center";

    let { data, topFivePresentations } = responseText;

    let {numberOfUsers, numberOfPresentations, numberOfPreferences,
        maxNumberOfPreference, averageNumberOfPreference, mostPreferredPresentation} = data;

    let userCountTableData = document.getElementById("user-count");
    userCountTableData.innerText += numberOfUsers;
    userCountTableData.className += TEXT_CENTER_CLASSNAME;

    let presentationCountTableData = document.getElementById("presentation-count");
    presentationCountTableData.innerText += numberOfPresentations;
    presentationCountTableData.className += TEXT_CENTER_CLASSNAME;

    let preferenceCountTableData = document.getElementById("preference-count");
    preferenceCountTableData.innerText += numberOfPreferences;
    preferenceCountTableData.className += TEXT_CENTER_CLASSNAME;

    let maxPreferenceCountTableData = document.getElementById("max-preference-count");
    maxPreferenceCountTableData.innerText += maxNumberOfPreference;
    maxPreferenceCountTableData.className += TEXT_CENTER_CLASSNAME;

    let averagePreferenceCountTableData = document.getElementById("average-preference-count");
    averagePreferenceCountTableData.innerText += averageNumberOfPreference;
    averagePreferenceCountTableData.className += TEXT_CENTER_CLASSNAME;

    let mostPopularPresentationTableData = document.getElementById("most-popular-presentation");
    mostPopularPresentationTableData.innerText += mostPreferredPresentation;
    mostPopularPresentationTableData.className += TEXT_CENTER_CLASSNAME;

    topFivePresentations.sort((left, right) => (parseInt(left.count) < parseInt(right.count)) ? 1 : -1);

    let positionCounter = 1;
    let tableBody = document.getElementById("statistics-top-five-body");

    for (let sortedPresentation of topFivePresentations) {
        let tableRow = document.createElement("tr");

        let tableDataFirst = document.createElement("td");
        let tableDataSecond = document.createElement("td");

        tableDataFirst.innerText += `${positionCounter++}. ${sortedPresentation.theme}`;
        tableDataSecond.innerText += `${sortedPresentation.count}`;

        tableRow.appendChild(tableDataFirst);
        tableRow.appendChild(tableDataSecond);

        tableBody.appendChild(tableRow);
    }
}

function addHighlight(preferenceButton) {
    preferenceButton.className += " active";
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