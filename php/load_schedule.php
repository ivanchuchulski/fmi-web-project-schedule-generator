<?php

require_once "utility.php";
require_once "presentation.php";
require_once "preference.php";

function loadSchedule() {
	try {
		checkSessionSet();

		$config = parse_ini_file("config/config.ini", true);

		$presentationsFilePath = $config['presentations']['path'];
		$show = $config['showPreferencesOnMainPage']['show'];
		$displayNumberOfPreferences = null;

		// if the value of $show is missing, 0, FALSE it is considered empty
		if (empty($show)) {
			$displayNumberOfPreferences = FALSE;
		}
		else {
			$displayNumberOfPreferences = TRUE;
		}

		if (!file_exists($presentationsFilePath)) {
			throw new Exception("грешка : файлът с презентациите не може да бъде намерен");
		}

		$presentationsJSONString = file_get_contents($presentationsFilePath);

		$decodedPresentations = json_decode($presentationsJSONString, true);
		$presentation = new Presentation();
		$preference = new Preference();
		$username = $_SESSION['username'];
		$EMPTY_PRESENTATION_PREFERENCE = 'empty';

		foreach ($decodedPresentations as &$decodedPresentation) {
			if (!$presentation->presentationExists($decodedPresentation)) {
				$presentation->addPresentationData($decodedPresentation);
			}

			// here  $decodedPresentation['theme'] is from the JSON
			$preferenceDetails = array('username' => $username, 'presentationTheme' => $decodedPresentation['theme']);
			$presentationPreference = $preference->getPreferenceByUsernameAndTheme($preferenceDetails);

			if (!empty($presentationPreference)) {
				$decodedPresentation['preferenceType'] = $presentationPreference['preferenceType'];
			}
			else {
				$decodedPresentation['preferenceType'] = $EMPTY_PRESENTATION_PREFERENCE;
			}

			if ($displayNumberOfPreferences) {
				$decodedPresentation += $preference->getAllNumberOfPreferencesForAGivenPresentation($decodedPresentation['theme']);
			}
		}

		$response = ['success' => true, 'data' => json_encode($decodedPresentations), 'username' => $username, 'displayNumberOfPreferences' => $displayNumberOfPreferences];
		echo json_encode($response);
	}
	catch (Exception $exception) {
		$response = ['success' => false, 'error' => $exception->getMessage()];
		echo json_encode($response);
	}
}

?>