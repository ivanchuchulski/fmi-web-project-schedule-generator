<?php
require_once "database.php";

class Presentation
{
	private $database;

	public function __construct() {
		$this->database = new Database();
	}

	public function addPresentationData(array &$presentationDetails) {
		$query = $this->database->insertPresentation($presentationDetails);

		if (!$query) {
			throw new Exception("error : insert presentation failed");
		}
	}


	public function presentationExists(array &$presentationDetails) {
		$presentation = $this->selectPresentationByTheme($presentationDetails['theme']);

		if (empty($presentation)) {
			return false;
		}
		else {
			return true;
		}
	}

	private function selectPresentationByTheme($presentationTheme) {
		$query = $this->database->selectPresentationByTheme($presentationTheme);

		return $query->fetch(PDO::FETCH_ASSOC);
	}
}

?>