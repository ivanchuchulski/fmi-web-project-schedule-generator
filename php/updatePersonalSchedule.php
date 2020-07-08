<?php

require_once "utility.php";
require_once "preference.php";

function updatePersonalSchedule() {
	try {
		checkSessionSet();

		// TODO : check if its empty
		// TODO : check if preferences are correct

		$preferencesData = json_decode($_POST['preferencesData'], true);
		$preference = new Preference();

		$username = $_SESSION['username'];
		$CANCEL_PREFERENCE = "cancelAttend";

		foreach ($preferencesData as $preferenceDetails) {
			$preferenceType = $preferenceDetails['preferenceType'];
			$preferenceDetails['username'] = $username;

			$preferencesRow = $preference->getPreferenceByUsernameAndTheme($preferenceDetails);

			if (empty($preferencesRow)) {
				throw new Exception("грешка : префернцията не съществува");
			}

			if (strcmp($preferenceType, $CANCEL_PREFERENCE) == 0) {
				$removeDetails = array('username' => $username, 'presentationTheme' => $preferenceDetails['presentationTheme']);
				$preference->removeUserPreference($removeDetails);
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
	};

}


?>