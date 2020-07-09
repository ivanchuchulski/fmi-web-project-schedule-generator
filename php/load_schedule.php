<?php

require_once "utility.php";
require_once "presentation.php";
require_once "preference.php";

function loadSchedule() {
	try {
		checkSessionSet();

		$presentationsJSONString = file_get_contents("json/presentations.json");

		if (!isset($presentationsJSONString)) {
			throw new Exception("грешка : файлът с презентациите не може да бъде намерен");
		}

		$decodedPresentations = json_decode($presentationsJSONString, true);
		$presentation = new Presentation();
		$preference = new Preference();
		$username = $_SESSION['username'];
		$EMPTY_PRESENTATION_PREFERENCE= 'empty';

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
		}

		$response = ['success' => true, 'data' => json_encode($decodedPresentations), 'username' => $username];
		echo json_encode($response);
	}
	catch (Exception $exception) {
		$response = ['success' => false, 'error' => $exception->getMessage()];
		echo json_encode($response);
	}
}

?>