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
		$user = $this->selectUserByUsername($formFields['usernameRegister']);

		//    var_dump($user); echo '<br>';

		if(!empty($user)) {
			throw new Exception('грешка : потребителят вече е регистриран');
		}
	}

	public function checkIfUserExists(array& $formFields) {
		$user = $this->selectUserByUsername($formFields['usernameLogin']);

		//    var_dump($user); echo '<br>';

		if(empty($user)) {
			throw new Exception('грешка : потребителят не е регистриран');
		}

		$passwordHash = $user['password'];

		if (!password_verify($formFields['passwordLogin'], $passwordHash)) {
			throw new Exception('грешка : паролата е грешна');
		}
	}

	private function selectUserByUsername($usernameRegister) {
		$query = $this->database->selectUserByUsername($usernameRegister);

		return $query->fetch(PDO::FETCH_ASSOC);
	}
}
?>
