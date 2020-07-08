<?php

require_once "utility.php";
require_once "presentation.php";

function loadSchedule() {
	try {
		checkSessionSet();

		$events = file_get_contents("json/presentations.json");

		if (!isset($events)) {
			throw new Exception("грешка : файлът с презентациите не може да бъде намерен");
		}

		$decode_events = json_decode($events, true);

		$presentation = new Presentation();

		foreach ($decode_events as $event) {
			if (!$presentation->presentationExists($event)) {
				$presentation->addPresentationData($event);
			}
		}

		$username = $_SESSION['username'];

		$response = ['success' => true, 'data' => $events, 'username' => $username];
		echo json_encode($response);
	}
	catch (Exception $exception) {
		$response = ['success' => false, 'error' => $exception->getMessage()];
		echo json_encode($response);
	}
}

?>