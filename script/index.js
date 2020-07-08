// TODO
// make error messages in bulgarian
(function() {
    let registerButton = document.getElementById('register-button');
    let enterButton = document.getElementById('enter-button');

    registerButton.addEventListener('click', register);
    enterButton.addEventListener('click', login);
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

        const REGISTER_REQUEST_URL = 'php/api.php/registration';
        const REGISTER_METHOD = 'POST';
        sendRegistrationRequest(REGISTER_REQUEST_URL, REGISTER_METHOD, `formData=${JSON.stringify(formData)}`);
    }
    catch (exception) {
        displayRegistrationError(exception);
    }
}

function login(clickEvent) {
    try {
        clickEvent.preventDefault();

        let formData = {
            usernameLogin : null,
            passwordLogin : null
        };
    
        formData['usernameLogin'] = validateLoginUsername('login-username');
        formData['passwordLogin'] = validateLoginPassword('login-password');
        
        console.log("formData :");
        printObject(formData);

        const LOGIN_REQUEST_URL = 'php/api.php/login';
        const LOGIN_METHOD = 'POST';

        sendLoginRequest(LOGIN_REQUEST_URL, LOGIN_METHOD, `formData=${JSON.stringify(formData)}`);
    }
    catch (exception) {
        displayLoginError(exception);
    }
}

function validateEmail(elementId) {
    const lowerLimit = 5;
    const upperLimit = 50;
    const pattern = `^[A-Za-z0-9_-]{${lowerLimit},${upperLimit}}@[a-z]+\.[a-z]+$`;
    const regex = new RegExp(pattern);

    let email = document.getElementById(`${elementId}`).value;

    if (email === '') {
        throw 'грешка: имейлът е задължително поле';
    }

    if (!email.match(regex)) {
        throw 'грешка: имейлът трябва да е във формат example@domain.com';
    }
    
    return formatInput(email);
}

function validateUsername(elementId) {
    const lowerLimit = 3;
    const upperLimit = 50;
    const pattern = `^[A-Za-z0-9_-]{${lowerLimit},${upperLimit}}$`;
    const regex = new RegExp(pattern);

    let username = document.getElementById(`${elementId}`).value;

    if (username === '') {
        throw 'грешка: потребителското име е задължително поле';
    }

    if (!username.match(regex)) {
        throw `грешка: потребителското име трябва да съдържа само букви, цифри, _ и -`;
    }
    
    return formatInput(username);
}

function validatePassword(elementId) {
    const lowerLimit = 6;
    const upperLimit = 20;
    const pattern = `^[A-Za-z0-9]{${lowerLimit},${upperLimit}}$`;
    const regex = new RegExp(pattern);

    let password = document.getElementById(`${elementId}`).value;

    // display error messages depending on the calling field
    // if (`${elementId}` === 'register-password-repeated') {

    // }
    // else {

    // }

    if (password === '') {
        throw `грешка: ${elementId} е задължително поле`;
    }

    if (!containsUppercaseLetter(password)) {
        throw `грешка: ${elementId} трябва да съдържа поне една главна буква`;
    }

    if (!containsDigit(password)) {
        throw `грешка: ${elementId} трябва да съдържа поне една цифра`;
    }

    if (!password.match(regex)) {
        throw `грешка: ${elementId} трябва да има дължина между ${lowerLimit} и ${upperLimit} символа`;
    }
    
    return formatInput(password);
}

function validateLoginUsername(elementId) {
    let username = document.getElementById(`${elementId}`).value;

    if (username === '') {
        throw 'грешка: потребителското име е задължително';
    }

    
    return formatInput(username);
}

function validateLoginPassword(elementId) {
    let password = document.getElementById(`${elementId}`).value;

    if (password === '') {
        throw 'грешка: паролата е задължително поле';
    }

    return formatInput(password);
}

function checkIfPasswordsMatch(password, passwordRepeated) {
    if (password !== passwordRepeated) {
        throw 'грешка: паролите трябва да съвпадат';
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

function sendRegistrationRequest(url, method, data) {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener('load', r => registrationRequestHandler(xhr));

    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data);
}

function sendLoginRequest(url, method, data) {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener('load', r => loginRequestHandler(xhr));

    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data);
}

function registrationRequestHandler(xhr) {
    let response = JSON.parse(xhr.responseText);
    
    if (response.success) {
        console.log('success');
        //changed from 'registration' to match form id
        let regForm = document.getElementById('registration-form');
        regForm.reset();
        displayRegistrationError("успешна регистрация");
    }
    else {
        displayRegistrationError(response.error);
    }
}

function loginRequestHandler(xhr) {
    let response = JSON.parse(xhr.responseText);
    
    if (response.success) {
        console.log('success');
        displaySchedulePage('schedule.html')
    }
    else {
        displayLoginError(response.error);
    }
}

function displaySchedulePage(pageURL) {
    window.location = pageURL;
}

function displayRegistrationError(error) {
    let errorLabel = document.getElementById('registration-error');
    errorLabel.innerHTML = error; 
}

function displayLoginError(error) {
    let errorLabel = document.getElementById('login-error');
    errorLabel.innerHTML = error; 
}

function printObject(object) {
    console.log(JSON.stringify(object, null, 4));
}