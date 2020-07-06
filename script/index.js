// using the javascript immediately-invoked function expression (IIFE)
(function () {
	let myheader = document.getElementById("myh1");

	myheader.innerText += ", and from js";


	document.getElementById("list-button").addEventListener("click", listView);
	document.getElementById("grid-button").addEventListener("click", gridView);

	// the "active" class in the button elements determines which button is highlighed
	// by default we start with list view
    listView();

    sendRequest();
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

function sendRequest() {
	const url = "php/test.php";
	const method = "POST";
	let data = "opa";

	ajaxRequest(url, method, `data=${JSON.stringify(data)}`);
}

function ajaxRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => requestHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function requestHandler(xhr) {
	const SUCCESS = 200;
	let response = JSON.parse(xhr.responseText);

	if (xhr.status === SUCCESS) {
		printObject(response);
	} else {
		logError(response);
	}
}

function printObject(object) {
	console.log("response : ");
	console.log(JSON.stringify(object, null, 4));
}

function logError(object) {
	console.error("errors : ");
	console.error(JSON.stringify(object, null, 4));
}
