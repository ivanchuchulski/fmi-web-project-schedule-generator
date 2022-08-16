<?php

require_once "utility.php";
require_once "repository" . DIRECTORY_SEPARATOR . "preference.php";

function generatePersonalSchedule() {
	try {
		checkSessionSet();

		// TODO : check if its empty
		// TODO : check if preferences are correct

		$preferencesData = json_decode($_POST['preferencesData'], true);
		$preference = new Preference();

		$username = $_SESSION['username'];

		foreach ($preferencesData as $preferenceDetails) {
			$preferenceDetails['username'] = $username;

			$preferencesRow = $preference->getPreferenceByUsernameAndTheme($preferenceDetails);

			if (empty($preferencesRow)) {
				$preference->addPreferenceData($preferenceDetails);
			}
			else {
				$preference->updateUserPreference($preferenceDetails);
			}
		}

		$response = ['success' => true];
		echo json_encode($response);
	}
	catch (Exception $exception) {
		$response = ['success' => false, 'error' => $exception->getMessage()];
		echo json_encode($response);
	}
}

?>