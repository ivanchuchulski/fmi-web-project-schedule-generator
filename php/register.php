<?php

require_once "utility.php";
require_once "user.php";

function registration() {
	try {
		checkServerRequestMethod();

		$formFields = getRegisterFormFields();
		$formFields['passwordRegister'] = password_hash($formFields['passwordRegister'], PASSWORD_DEFAULT);
		$user = new User();

		$user->checkIfUserIsRegistered($formFields);
		$user->addUserData($formFields);

		$response = ['success' => true];
		echo json_encode($response);
	}
	catch (Exception $exception) {
		$response = ['success' => false, 'error' => $exception->getMessage()];
		echo json_encode($response);
	}
}

function getRegisterFormFields(): array {
	try {
		$formFields = array();

		$formFields['emailRegister'] = validateEmail('emailRegister');
		$formFields['usernameRegister'] = validateUsername('usernameRegister');
		$formFields['passwordRegister'] = validatePassword('passwordRegister');

		return $formFields;
	}
	catch (Exception $exception) {
		throw $exception;
	}
}


function validateEmail($nameOfTheField) {
	$lowerLimit = 5;
	$upperLimit = 50;
	$pattern = "/^[A-Za-z0-9_-]{{$lowerLimit},{$upperLimit}}@[a-z]+\.[a-z]+$/";

	$formData = json_decode($_POST["formData"], true);
	$emailField = $formData[$nameOfTheField];

	if (!$emailField) {
		throw new Exception("грешка: имейлът е задължително поле");
	}

	if (!preg_match($pattern, $emailField)) {
		throw new Exception("грешка: имейлът трябва да е във формат example@domain.com");
	}

	return formatInput($emailField);
}

function validateUsername($nameOfTheField) {
	$lowerLimit = 3;
	$upperLimit = 50;
	$pattern = "/^[A-Za-z0-9_-]{{$lowerLimit},{$upperLimit}}$/";

	$formData = json_decode($_POST["formData"], true);
	$usernameField = $formData[$nameOfTheField];

	if (!$usernameField) {
		throw new Exception("грешка: потребителското име е задължително поле");
	}

	if (!preg_match($pattern, $usernameField)) {
		throw new Exception("грешка: потребителското име трябва да съдържа само букви, цифри и _");
	}

	return formatInput($usernameField);
}

function validatePassword($nameOfTheField) {
	$lowerLimit = 5;
	$upperLimit = 50;
	$pattern = "/^[A-Za-z0-9]{{$lowerLimit},{$upperLimit}}$/";

	$formData = json_decode($_POST["formData"], true);
	$passwordField = $formData[$nameOfTheField];

	if (!$passwordField) {
		throw new Exception("грешка: паролата е задължително поле");
	}

	if (!preg_match($pattern, $passwordField)) {
		throw new Exception("грешка: паролата трябва да съдържа само букви или цифри");
	}

	return formatInput($passwordField);
}

?>