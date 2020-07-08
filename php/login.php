<?php

require_once "utility.php";
require_once "user.php";

function login() {
	try {
		checkServerRequestMethod();
		$formFields = getLoginFormFields();

		$user = new User();

		$user->checkIfUserExists($formFields);

		$_SESSION['loggedIn'] = true;
		$_SESSION['username'] = $formFields['usernameLogin'];

		$response = ['success' => true];
		echo json_encode($response);
	}
	catch (Exception $exception) {
		$response = ['success' => false, 'error' => $exception->getMessage()];
		echo json_encode($response);
	}
}

function getLoginFormFields(): array {
	try {
		$formFields = array();

		$formFields['usernameLogin'] = getUsername('usernameLogin');
		$formFields['passwordLogin'] = getPassword('passwordLogin');

		return $formFields;
	}
	catch (Exception $exception) {
		throw $exception;
	}
}

function getUsername($nameOfTheField) {
	$formData = json_decode($_POST["formData"], true);
	$usernameField = $formData[$nameOfTheField];

	if (!$usernameField) {
		throw new Exception("грешка: потребителското име е задължително поле");
	}

	return formatInput($usernameField);
}

function getPassword($nameOfTheField) {
	$formData = json_decode($_POST["formData"], true);
	$passwordField = $formData[$nameOfTheField];

	if (!$passwordField) {
		throw new Exception("грешка: паролата е задължително поле");
	}
	return formatInput($passwordField);
}

?>