<?php

require_once "statistics.php";

 function generateStatistics() {

	 try {
		 checkSessionSet();

		 $stats = [];
		 $statistics = new Statistics();

		 $stats['numberOfUsers'] = $statistics->getNumberOfUsers();
		 $stats['numberOfPresentations'] = $statistics->getNumberOfPresentations();
		 $stats['numberOfPreferences'] = $statistics->getNumberOfPreferences();
		 $stats['maxNumberOfPreference'] = $statistics->getMaxNumberOfPreferencesFromAllUsers();
		 $stats['averageNumberOfPreference'] = $statistics->getAverageNumberOfPreferences();
		 $stats['mostPreferredPresentation'] = $statistics->getMostPreferredPresentation();

		 $response = ['success' => true, 'data' => json_encode($stats)];
		 echo json_encode($response);
	 }
	 catch (Exception $exception) {
		 $response = ['success' => false, 'error' => $exception->getMessage()];
		 echo json_encode($response);
	 }

}

?>