<?php

require_once "fpdf182/fpdf.php";
require_once "utility.php";

function exportScheduleInPdf() {
	try {
		checkSessionSet();

		$config = parse_ini_file("config/config.ini", true);
		$presentationsFilePath = $config['presentations']['path'];

		if (!file_exists($presentationsFilePath)) {
			throw new Exception("грешка : файлът с презентациите не може да бъде намерен");
		}

		$presentationsJSONString = file_get_contents($presentationsFilePath);
		$decodedPresentations = json_decode($presentationsJSONString, true);

		$pdf = new FPDF();
		$pdf->AddPage();
		$pdf->SetFont('Arial', 'B', 12);
		
		// does not support utf8?
		foreach ($decodedPresentations as &$decodedPresentation) {
			$pdf->Cell(200, 10, $decodedPresentation['theme'] 
			. "\t" . $decodedPresentation['presentDate'] 
			. "\t" . $decodedPresentation['dayNumber'],0,1);
	
			$pdf->Cell(200, 10, $decodedPresentation['presenterName'] 
			. "\t" . $decodedPresentation['facultyNumber'] 
			. "\t" . $decodedPresentation['groupNumber'],0,1);
	
			$pdf->Cell(200, 10, $decodedPresentation['place'],0,1);
		}

		// could use D option do force download at this point
		// in this case remove all other code below
		$filename = "download_files/output.pdf";
		$pdf->Output("F", $filename);

		// this forces the browser to download the file
		header("Content-type: application/octet-stream", true);
		header("Content-disposition: attachment;filename=$filename");

		readfile($filename);
	}
	catch (Exception $exception) {
		echo json_decode($exception->getMessage());
	}

}


?>