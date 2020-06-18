// using the javascript immediately-invoked function expression (IIFE)
(function () {
    let myheader = document.getElementById('myh1');

    myheader.innerText += ', and from js';

    sendRequest();

})();


function sendRequest() {
    const url = 'php/test.php';
    const method = 'POST';
    let data = 'opa'

    ajaxRequest(url, method, `data=${JSON.stringify(data)}`);
}


function ajaxRequest(url, method, data) {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener('load', r => requestHandler(xhr));

    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data);
}


function requestHandler(xhr) {
    const SUCCESS = 200;
    let response = JSON.parse(xhr.responseText);
        
    if (xhr.status === SUCCESS) {
        printObject(response);
    }
    else {
        logError(response)
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