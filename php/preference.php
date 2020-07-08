<?php
require_once "database.php";

class Preference
{
	private $database;

	public function __construct() {
		$this->database = new Database();
	}

	public function addPreferenceData(array &$preferenceDetails) {

		$query = $this->database->insertPreference($preferenceDetails);

		if (!$query) {
			throw new Exception("error : insert preference failed");
		}
	}

	public function updatePreference(array &$preferenceDetails) {
		$query = $this->database->updatePreference($preferenceDetails);

		if (!$query) {
			throw new Exception("error : update preference failed");
		}
	}

	public function getPreferenceByUsernameAndTheme(array &$presentationTheme) {
		$query = $this->database->selectPreferencesByUsernameAndTheme($presentationTheme);

		return $query->fetch(PDO::FETCH_ASSOC);
	}

	public function getPreferredPresentationsForUser(string& $username) {
		$query = $this->database->selectPreferredPresentationsForUser($username);

		//	TODO : fix results
		return $query->fetchAll(PDO::FETCH_UNIQUE);
	}
}

?>