// using the javascript immediately-invoked function expression (IIFE)
(function () {

    window.onload = () => loadStatistics();

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

function loadStatistics() {
    const LOAD_SCHEDULE_URL = "php/api.php/statistics";
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
        console.log("success load statistics");
        drawStatistics(response);
    } else {
        console.log("error : load statistics");
        displayMessage(
            "грешка : не е започната сесия или сесията е изтелкла(или файлът със събитията не може да бъде зареден)"
        );
    }
}

function drawStatistics(response) {
    const TEXT_CENTER_CLASSNAME = "text-center";

    let statisticsList = response.data;
    let topPresentations = response.topFivePresentations;

    let numberUsers = statisticsList.numberOfUsers;
    let numberPresentations = statisticsList.numberOfPresentations;
    let numberPreferences = statisticsList.numberOfPreferences;
    let maxNumberOfPreference = statisticsList.maxNumberOfPreference;
    let averageNumberOfPreference = statisticsList.averageNumberOfPreference;
    let mostPreferredPresentation = statisticsList.mostPreferredPresentation;

    let userCountTableData = document.getElementById("user-count");
    userCountTableData.innerText += numberUsers;
    userCountTableData.className += TEXT_CENTER_CLASSNAME;

    let presentationCountTableData = document.getElementById("presentation-count");
    presentationCountTableData.innerText += numberPresentations;
    presentationCountTableData.className += TEXT_CENTER_CLASSNAME;

    let preferenceCountTableData = document.getElementById("preference-count");
    preferenceCountTableData.innerText += numberPreferences;
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

    let tbody = document.getElementById("statistics-top-five-body");

    let positionCounter = 1;
    topPresentations.forEach(presentation => {
        let tr = document.createElement("tr");

        tr.innerHTML += `<td>${positionCounter}. ${presentation.theme}</td>
                        <td>${presentation.count} </td>`;
                        
        positionCounter++;

        tbody.appendChild(tr);
    });

}


function addHighlight(preferenceButton) {
    preferenceButton.className += " active";
}

function displayMessage(text) {
    let messageLabel = document.getElementById("messageLabel");

    messageLabel.innerText = text;
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