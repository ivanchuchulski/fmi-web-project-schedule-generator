<?php

class Database
{
	private $connection;

	public function __construct() {
		$config = parse_ini_file("database-setup/db-config.ini", true);

		$host = $config['db']['host'];
		$dbname = $config['db']['name'];
		$user = $config['db']['user'];
		$password = $config['db']['password'];

		$this->initialize($host, $dbname, $user, $password);
	}

	public function __destruct() {
		$this->connection = null;
	}

	//	user queries
	public function insertUser($data) {
		try {
			$sql = "INSERT INTO user (username, password, email) VALUES(:usernameRegister, :passwordRegister, :emailRegister);";
			$insertStatement = $this->connection->prepare($sql);
			$result = $insertStatement->execute($data);

			return $result;
		}
		catch (PDOException $exception) {
			throw $exception;
		}
	}

	public function selectUserByUsername(string &$username) {
		try {
			$sql = "SELECT * FROM user WHERE username=:username;";

			$selectStatement = $this->connection->prepare($sql);

			$selectStatement->execute(array("username" => $username));

			return $selectStatement;
		}
		catch (PDOException $exception) {
			throw $exception;
		}
	}

	//	presentation queries
	public function insertPresentation($data) {
		try {
			$sql = "INSERT INTO presentation (theme , presentDate, presenterName, place) 
            VALUES(:theme, :presentDate, :presenterName, :place);";

			$insertStatement = $this->connection->prepare($sql);
			$result = $insertStatement->execute($data);

			return $result;
		}
		catch (PDOException $exception) {
			throw $exception;
		}
	}

	public function selectPresentationByTheme(string &$theme) {
		try {
			$sql = "SELECT * FROM presentation WHERE theme = :theme;";

			$selectStatement = $this->connection->prepare($sql);

			$selectStatement->execute(array("theme" => $theme));

			return $selectStatement;
		}
		catch (PDOException $exception) {
			throw $exception;
		}
	}

	// preference queries
	public function updatePreference(array &$preferenceDetails) {
		try {
			$sql = "UPDATE preference
					SET preferenceType=:preferenceType
					WHERE username=:username and presentationTheme=:presentationTheme;";

			$updateStatement = $this->connection->prepare($sql);

			$result = $updateStatement->execute($preferenceDetails);

			return $result;
		}
		catch (PDOException $exception) {
			throw $exception;
		}
	}

	public function selectPreferencesByUsernameAndTheme(array &$preferenceDetails) {
		try {
			$sql = "SELECT * FROM preference WHERE username=:username and presentationTheme=:presentationTheme;";

			$selectStatement = $this->connection->prepare($sql);

			$selectStatement->execute(array("username" => $preferenceDetails['username'],
				"presentationTheme" => $preferenceDetails['presentationTheme']));

			return $selectStatement;
		}
		catch (PDOException $exception) {
			throw $exception;
		}
	}

	public function insertPreference($data) {
		try {
			$sql = "INSERT INTO preference (username, presentationTheme, preferenceType) 
					VALUES(:username, :presentationTheme, :preferenceType);";

			$insertStatement = $this->connection->prepare($sql);
			$result = $insertStatement->execute($data);

			return $result;
		}
		catch (PDOException $exception) {
			throw $exception;
		}
	}

	private function initialize($host, $database, $user, $password) {
		try {
			$this->connection = new PDO("mysql:host=$host;dbname=$database", $user, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
		}
		catch (PDOException $exception) {
			throw $exception;
		}
	}
}

?>