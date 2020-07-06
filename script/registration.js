(function() {
    let registerButton = document.getElementById('register-button');
    let enterButton = document.getElementById('enter-button');

    registerButton.addEventListener('click', register);
    // enterButton.addEventListener('click', login);
})();

function register(clickEvent) {
    try {
        clickEvent.preventDefault();

        let formData = {
                emailRegister : null,
                usernameRegister : null,
                passwordRegister : null
        };

        // Qwerty1234
        formData['emailRegister'] = validateEmail('register-email');
        formData['usernameRegister'] = validateUsername('register-username');
        formData['passwordRegister'] = validatePassword('register-password');
        let passwordRepeatedRegister = validatePassword('register-password-repeated');

        checkIfPasswordsMatch(formData['passwordRegister'], passwordRepeatedRegister);

        console.log("formData :");
        printObject(formData);
        fail;

        // sendAjaxRequest('backend/register.php', 'POST', `formData=${JSON.stringify(formData)}`);
    }
    catch (exception) {
        displayRegistrationError(exception);
    }
}

function login(clickEvent) {
    clickEvent.preventDefault();

    console.log('login');
}

function validateEmail(elementId) {
    const lowerLimit = 3;
    const upperLimit = 35;
    const pattern = `^[A-Za-z_-]{${lowerLimit},${upperLimit}}@[a-z]+\.[a-z]+$`;
    const regex = new RegExp(pattern);

    let email = document.getElementById(`${elementId}`).value;

    if (email === '') {
        throw 'error : email is required';
    }

    if (!email.match(regex)) {
        throw 'error : email must have the following form : example@domain-name.com';
    }
    
    return formatInput(email);
}

function validateUsername(elementId) {
    const lowerLimit = 3;
    const upperLimit = 20;
    const pattern = `^[A-Za-z-_]{${lowerLimit},${upperLimit}}$`;
    const regex = new RegExp(pattern);

    let username = document.getElementById(`${elementId}`).value;

    if (username === '') {
        throw 'error : username is required';
    }

    if (!username.match(regex)) {
        throw `error : username must contain only letters and be between ${lowerLimit} and ${upperLimit} symbols`;
    }
    
    return formatInput(username);
}

function validatePassword(elementId) {
    const lowerLimit = 6;
    const upperLimit = 10;
    const pattern = `^[A-Za-z0-9]{${lowerLimit},${upperLimit}}$`;
    const regex = new RegExp(pattern);

    let password = document.getElementById(`${elementId}`).value;

    if (password === '') {
        throw 'error : password is required';
    }

    if (!containsUppercaseLetter(password)) {
        throw `error : ${elementId} must contain only at least one uppercase letter`;
    }

    if (!containsDigit(password)) {
        throw `error : ${elementId} must contain only at least one digit`;
    }

    if (!password.match(regex)) {
        throw `error : password must contain only at least one uppercase letter, at least one digit and be between ${lowerLimit} and ${upperLimit} symbols`;
    }
    
    return formatInput(password);
}

function checkIfPasswordsMatch(password, passwordRepeated) {
    console.log('opa');
    console.log(password);
    console.log(passwordRepeated);
    if (password !== passwordRepeated) {
        throw 'passwords do not match';
    }
}

function formatInput(formField) {
    formField = trimTrailingWhitespace(formField);
    formField = removeSlashes(formField);
    formField = removeHTMLSpecialCharacters(formField);
    
    return formField;
}

function containsUppercaseLetter(str) {
    return str.match(/[A-Z]/);
}

function containsDigit(str) {
    return str.match(/[0-9]/);
}

function trimTrailingWhitespace(str) {
    return str.trim();
}

function removeSlashes(str) {
    return str.replace(/\//g, '');
}

function removeHTMLSpecialCharacters(str) {

    let htmlSpecialCharactersMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
    
      return str.replace(/[&<>"']/g, function(symbol) { return htmlSpecialCharactersMap[symbol]; });
}

function sendAjaxRequest(url, method, data) {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener('load', r => requestHandler(xhr));

    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data);
}

function requestHandler(xhr) {
    let response = JSON.parse(xhr.responseText);
    
    if (response.success) {
        displaySuccessPage('success.html');
    }
    else {
        displayErrors(response.error);
    }
}

function displaySuccessPage(pageURL) {
    window.location = pageURL;
}

function displayRegistrationError(error) {
    let errorLabel = document.getElementById('register-error');
    errorLabel.innerHTML = error; 
}

function displayLoginError(error) {
    let errorLabel = document.getElementById('login-error');
    errorLabel.innerHTML = error; 
}

function printObject(object) {
    console.log(JSON.stringify(object, null, 4));
}