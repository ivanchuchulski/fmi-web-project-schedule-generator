<?php

require_once "statistics.php";

 function generateStatistics() {

	 try {
		 checkSessionSet();

		 $stats = [];
		 $statistics = new Statistics();

		 $stats += $statistics->getNumberOfUsers();
		 $stats += $statistics->getNumberOfPresentations();
		 $stats += $statistics->getNumberOfPreferences();
		 $stats += $statistics->getMaxNumberOfPreferencesFromAllUsers();
		 $stats += $statistics->getAverageNumberOfPreferences();
		 $stats += $statistics->getMostPreferredPresentation();

		 $stats += $statistics->getTopFivePresentations();

		 $response = ['success' => true, 'data' => $stats];
		 echo json_encode($response);
	 }
	 catch (Exception $exception) {
		 $response = ['success' => false, 'error' => $exception->getMessage()];
		 echo json_encode($response);
	 }

}

?>