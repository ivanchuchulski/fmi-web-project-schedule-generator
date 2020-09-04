<?php

require_once "utility.php";

function exportFullScheduleToCSV() {
	try {
		checkSessionSet();

		$config = parse_ini_file("config/config.ini", true);
		$presentationsFilePath = $config['presentations']['path'];
			
		if (!file_exists($presentationsFilePath)) {
			throw new Exception("грешка : файлът с презентациите не може да бъде намерен");
		}
		
		$presentationsJSONString = file_get_contents($presentationsFilePath);
		$decodedPresentations = json_decode($presentationsJSONString, true);

		$output = fopen("php://output","w");
		$filename = "fullSchedule.csv";
		//header("Content-type: application/octet-stream", true);
		header("Content-Type:application/csv"); 
		header("Content-disposition: attachment;filename=$filename"); 

		foreach ($decodedPresentations as &$decodedPresentation) {
			fputcsv($output, $decodedPresentation);
		}
		  
		fclose($output);
	}
	catch (Exception $exception) {
		echo json_decode($exception->getMessage());
	}
}


?>