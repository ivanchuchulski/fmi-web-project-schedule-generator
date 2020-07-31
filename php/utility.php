<?php

function checkIfServerRequestMethodIsPOST() {
	if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
		throw new Exception("error : use POST method must be used");
	}
}

function formatInput($formField): string {
	$formField = trim($formField);
	$formField = stripslashes($formField);
	$formField = htmlspecialchars($formField);

	return $formField;
}

function checkSessionSet() {
	if (!isset($_SESSION['loggedIn'])) {
		throw new Exception("грешка: няма започната сесия");
	}

	if ($_SESSION['loggedIn'] === false) {
		throw new Exception("грешка: потребителят не е вписан в системата");
	}

	if ($_SESSION['username'] === false) {
		throw new Exception("грешка: потребителското име не е в сесията");
	}
}

?>