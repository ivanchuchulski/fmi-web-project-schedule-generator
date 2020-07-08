<?php

require_once "utility.php";
require_once "presentation.php";
require_once "preference.php";

function loadSchedule() {
	try {
		checkSessionSet();

		$events = file_get_contents("json/presentations.json");

		if (!isset($events)) {
			throw new Exception("грешка : файлът с презентациите не може да бъде намерен");
		}

		$decode_events = json_decode($events, true);
		$presentation = new Presentation();
		$preference = new Preference();
		$username = $_SESSION['username'];
		$EMPTY_PRESENTATION_PREFERENCE= 'empty';

		foreach ($decode_events as &$event) {
			if (!$presentation->presentationExists($event)) {
				$presentation->addPresentationData($event);
			}

			// here  $event['theme'] is from the JSON
			$preferenceDetails = array('username' => $username, 'presentationTheme' => $event['theme']);
			$eventPreference = $preference->getPreferenceByUsernameAndTheme($preferenceDetails);

			if (!empty($eventPreference)) {
				$event['preferenceType'] = $eventPreference['preferenceType'];
			}
			else {
				$event['preferenceType'] = $EMPTY_PRESENTATION_PREFERENCE;
			}
		}

		$response = ['success' => true, 'data' => json_encode($decode_events), 'username' => $username];
		echo json_encode($response);
	}
	catch (Exception $exception) {
		$response = ['success' => false, 'error' => $exception->getMessage()];
		echo json_encode($response);
	}
}

?>