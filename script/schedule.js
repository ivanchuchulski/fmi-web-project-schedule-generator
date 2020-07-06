// using the javascript immediately-invoked function expression (IIFE)
(function () {
    window.onload = () => loadEvents();

	let myheader = document.getElementById("myh1");

	myheader.innerText += ", and from js";


	document.getElementById("list-button").addEventListener("click", listView);
	document.getElementById("grid-button").addEventListener("click", gridView);

	// the "active" class in the button elements determines which button is highlighed
	// by default we start with list view
    listView();


})();

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

function loadEvents() {
	const LOAD_SCHEDULE_URL = "php/api.php/loadSchedule";
	const LOAD_SCHEDULE_METHOD = "GET";

	ajaxRequest(LOAD_SCHEDULE_URL, LOAD_SCHEDULE_METHOD);
}

function ajaxRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => requestHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(data);
}

function requestHandler(xhr) {
	let response = JSON.parse(xhr.responseText);

	if (response.success) {
        console.log('success load schedule');
		printObject(response.data);
		drawEvents(response.data);
    }
    else {
		console.log('error : load schedule');
    }
}

function printObject(object) {
	let jsonAsString = JSON.parse(object);
	
	console.log("print object : ");
	console.log(JSON.stringify(object, null, 4));
	console.log(jsonAsString);
}

function drawEvents(events) {
	let eventParent = document.getElementById('event-list');

	console.log("events : ");
	console.log(events);
	console.log(JSON.stringify(JSON.parse(events), null, 4));
	
	let eventList = JSON.parse(events); 
	console.log(JSON.stringify(eventList, null, 4));

	// draw in html
}

function drawEvents(events) {
	let eventParent = document.getElementById('event-list');

}

function logError(object) {
	console.error("errors : ");
	console.error(JSON.stringify(object, null, 4));
}
