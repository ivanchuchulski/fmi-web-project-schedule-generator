<?php

require_once "user.php";

start();

function start() {
	header("Content-type: application/json");

	$requestURL = $_SERVER["REQUEST_URI"];


	if (preg_match("/registration$/", $requestURL)) {
		registration();
	}
	elseif (preg_match("/login$/", $requestURL)) {
		login();
	}
	elseif (preg_match("/logout$/", $requestURL)) {
		logout();
	}
	else {
		echo json_encode(["error" => "Не е намерен такъв URL"]);
	}
}

function registration() {
	try {
		checkServerRequestMethod();

		$formFields = getRegisterFormFields();
//		$formFields['passwordRegister'] = password_hash($formFields['passwordRegister'], PASSWORD_DEFAULT);
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

function checkServerRequestMethod() {
	if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
		throw new Exception("error : use post method");
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
	$pattern = "/^[A-Za-z_-]{{$lowerLimit},{$upperLimit}}@[a-z]+\.[a-z]+$/";

	$formData = json_decode($_POST["formData"], true);
	$textField = $formData[$nameOfTheField];

	if (!$textField) {
		throw new Exception("грешка: имейлът е задължително поле");
	}

	if (!preg_match($pattern, $textField)) {
		throw new Exception("грешка: имейлът трябва да е във формат example@domain.com");
	}

	return formatInput($textField);
}

function validateUsername($nameOfTheField) {
	$lowerLimit = 3;
	$upperLimit = 50;
	$pattern = "/^[A-Za-z0-9_]{{$lowerLimit},{$upperLimit}}$/";

	$formData = json_decode($_POST["formData"], true);
	$textField = $formData[$nameOfTheField];

	if (!$textField) {
		throw new Exception("грешка: потребителското име е задължително поле");
	}

	if (!preg_match($pattern, $textField)) {
		throw new Exception("грешка: потребителското име трябва да съдържа само букви, цифри и _");
	}

	return formatInput($textField);
}

function validatePassword($nameOfTheField) {
	$lowerLimit = 5;
	$upperLimit = 50;
	$pattern = "/^[A-Za-z0-9]{{$lowerLimit},{$upperLimit}}$/";

	$formData = json_decode($_POST["formData"], true);
	$textField = $formData[$nameOfTheField];

	if (!$textField) {
		throw new Exception("грешка: паролата е задължително поле");
	}

	if (!preg_match($pattern, $textField)) {
		throw new Exception("грешка: паролата трябва да съдържа само букви или цифри");
	}

	return formatInput($textField);
}


function formatInput($formField): string {
	$formField = trim($formField);
	$formField = stripslashes($formField);
	$formField = htmlspecialchars($formField);

	return $formField;
}

?>