<?php
require_once "database.php";

class User {
	private $database;

	public function __construct() {
		$this->database = new Database();
	}

	public function addUserData(array& $formFields) {
		$query = $this->database->insertUser($formFields);

		if (!$query) {
			throw new Exception("error : insert failed");
		}
	}

	public function checkIfUserIsRegistered(array& $formFields)
	{
		$query = $this->database->selectUserByUsername($formFields['usernameRegister']);

		$user = $query->fetch(PDO::FETCH_ASSOC);

		//    var_dump($user); echo '<br>';

		if(!empty($user)) {
			throw new Exception('грешка : потребителят вече е регистриран');
		}
	}
}
?>
