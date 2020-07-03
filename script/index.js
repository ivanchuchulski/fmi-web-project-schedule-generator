// using the javascript immediately-invoked function expression (IIFE)
(function () {
	let myheader = document.getElementById("myh1");

	myheader.innerText += ", and from js";

	// view the active class in the button, it determines which button is highlighed
    listView();

    sendRequest();
})();

function listView() {
    // Get the elements with class="column"
	var elements = document.getElementsByClassName("column");

	// Declare a loop variable
    var i;
    
    for (i = 0; i < elements.length; i++) {
        elements[i].style.width = "100%";
    }

    updateButtonHighlight();
}

function gridView() {
	// Get the elements with class="column"
	var elements = document.getElementsByClassName("column");

	// Declare a loop variable
	var i;

    for (i = 0; i < elements.length; i++) {
        elements[i].style.width = "50%";
    }

    updateButtonHighlight();
}

function updateButtonHighlight() {
    /* Optional: Add active class to the current button (highlight it) */
	var container = document.getElementById("btnContainer");
	var btns = container.getElementsByClassName("btn");

	for (var i = 0; i < btns.length; i++) {
		btns[i].addEventListener("click", function () {
			var current = document.getElementsByClassName("active");
			current[0].className = current[0].className.replace(" active", "");
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

	xhr.addEventListener("load", (r) => requestHandler(xhr));

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
