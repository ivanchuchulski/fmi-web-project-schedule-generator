<?php

require_once "statistics.php";

 function generateStatistics() {

	 try {
		 checkSessionSet();

		 $stats = [];
		 $statistics = new Statistics();

		 $stats['numberOfUsers'] = $statistics->getNumberOfUsers();

		 $response = ['success' => true, 'data' => $stats];
		 echo json_encode($response);
	 }
	 catch (Exception $exception) {
		 $response = ['success' => false, 'error' => $exception->getMessage()];
		 echo json_encode($response);
	 }

}


?>