<?php

require_once "utility.php";

function exportPersonalScheduleToCSV() {
	try {
        checkSessionSet();
        
        $username = $_SESSION['username'];
		$preference = new Preference();
		$preferencesRows = $preference->getPreferredPresentationsForUser($username);

		$output = fopen("php://output","w");
		$filename = "personalSchedule.csv";
		//header("Content-type: application/octet-stream", true);
		header("Content-Type:application/csv"); 
		header("Content-disposition: attachment;filename=$filename"); 

		foreach ($preferencesRows as &$preferencesRow) {
			fputcsv($output, $preferencesRow);
		}
		  
		fclose($output);
	}
	catch (Exception $exception) {
		echo json_decode($exception->getMessage());
	}
}


?>