<?php

require_once "fpdf182/fpdf.php";
require_once "utility.php";

function exportScheduleInPdf() {
	try {
		checkSessionSet();

		$filename = "download_files/output.pdf";


		$pdf = new FPDF();

		$pdf->AddPage();
		$pdf->SetFont('Arial', 'B', 16);

		$pdf->Cell(40, 10, 'Hello World!');

		// could use D option do force download at this point
		// in this case remove all other code below
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