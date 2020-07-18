<?php

require_once "tfpdf/tfpdf.php";
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
		
		$pdf = new tFPDF();
		$pdf->AddFont('DejaVu','','DejaVuSansCondensed.ttf',true);
		$pdf->SetFont('DejaVu','',11);
		$pdf->AddPage();

		foreach ($decodedPresentations as &$decodedPresentation) {
			$pdf->Cell(200, 10, $decodedPresentation['theme'] 
			. " " . $decodedPresentation['presentDate'] 
			. " " . $decodedPresentation['dayNumber'],0,1);
		
			$pdf->Cell(200, 10, $decodedPresentation['presenterName'] 
			. " " . $decodedPresentation['facultyNumber'] 
			. " " . $decodedPresentation['groupNumber'],0,1);
		
			$pdf->Cell(200, 10, $decodedPresentation['place'],0,1);
		}

		$filename = "download_files/output.pdf";
		$pdf->Output("F", $filename);

		header("Content-type: application/octet-stream", true);
		header("Content-disposition: attachment;filename=$filename");		
		readfile($filename);
	}
	catch (Exception $exception) {
		echo json_decode($exception->getMessage());
	}
}


?>