<?php

require_once "utility.php";
require_once "preference.php";

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

			$preferencesRows = $preference->getPreferenceByUsernameAndTheme($preferenceDetails);

			if (empty($preferencesRows)) {
				$preference->addPreferenceData($preferenceDetails);
			}
			else {
				var_dump($preferencesRows);
				$preference->updatePreference($preferenceDetails);
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