<?php

require_once "utility.php";
require_once "preference.php";
require_once "repository/presentation.php";

function loadPersonalSchedule() {
	try {
		checkSessionSet();

		$username = $_SESSION['username'];
		$preference = new Preference();

		$preferencesRows = $preference->getPreferredPresentationsForUser($username);

		$response = ['success' => true, 'data' => json_encode($preferencesRows), 'username' => $username];
		echo json_encode($response);
	}
	catch (Exception $exception) {
		$response = ['success' => false, 'error' => $exception->getMessage()];
		echo json_encode($response);
	}
}

?>