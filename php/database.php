<?php

class Database
{
    private $connection;

    public function __construct()
    {
        $config = parse_ini_file("config/config.ini", true);

        $host = $config['db']['host'];
        $dbname = $config['db']['name'];
        $user = $config['db']['user'];
        $password = $config['db']['password'];

        $this->initialize($host, $dbname, $user, $password);
    }

    public function __destruct()
    {
        $this->connection = null;
    }

    //	user queries
    public function insertUser($data)
    {
        try {
            $sql = "INSERT INTO user (username, password, email) VALUES(:usernameRegister, :passwordRegister, :emailRegister);";
            $insertStatement = $this->connection->prepare($sql);
            $result = $insertStatement->execute($data);

            return $result;
        } catch (PDOException $exception) {
            throw $exception;
        }
    }

    public function selectUserByUsername(string &$username)
    {
        try {
            $sql = "SELECT * FROM user WHERE username=:username;";

            $selectStatement = $this->connection->prepare($sql);

            $selectStatement->execute(array("username" => $username));

            return $selectStatement;
        } catch (PDOException $exception) {
            throw $exception;
        }
    }

    //	presentation queries
    public function insertPresentation($data)
    {
        try {
            $sql = "INSERT INTO presentation (theme , presentDate, dayNumber, presenterName, facultyNumber, groupNumber, place) 
				VALUES(:theme, :presentDate, :dayNumber, :presenterName, :facultyNumber, :groupNumber, :place);";

            $insertStatement = $this->connection->prepare($sql);
            $result = $insertStatement->execute($data);

            return $result;
        } catch (PDOException $exception) {
            throw $exception;
        }
    }

    public function selectPresentationByTheme(string &$theme)
    {
        try {
            $sql = "SELECT `theme`, `presentDate`, `presenterName`, `place`
                    FROM presentation 
                    WHERE theme = :theme;";

            $selectStatement = $this->connection->prepare($sql);

            $selectStatement->execute(array("theme" => $theme));

            return $selectStatement;
        } catch (PDOException $exception) {
            throw $exception;
        }
    }

    // preference queries
    public function updatePreference(array &$preferenceDetails)
    {
        try {
            $sql = "UPDATE preference
					SET preferenceType=:preferenceType
					WHERE username=:username and presentationTheme=:presentationTheme;";

            $updateStatement = $this->connection->prepare($sql);

            $result = $updateStatement->execute($preferenceDetails);

            return $result;
        } catch (PDOException $exception) {
            throw $exception;
        }
    }

    public function deletePreference(array &$preferenceDetails)
    {
        try {
//			var_dump($preferenceDetails);
            $sql = "DELETE FROM preference
					WHERE username=:username and presentationTheme=:presentationTheme;";

            $deleteStatement = $this->connection->prepare($sql);

            $result = $deleteStatement->execute($preferenceDetails);

            return $result;
        } catch (PDOException $exception) {
            throw $exception;
        }
    }

    public function selectPreferencesByUsernameAndTheme(array &$preferenceDetails)
    {
        try {
            $sql = "SELECT * FROM preference WHERE username=:username and presentationTheme=:presentationTheme;";

            $selectStatement = $this->connection->prepare($sql);

            $selectStatement->execute(array("username" => $preferenceDetails['username'],
                "presentationTheme" => $preferenceDetails['presentationTheme']));

            return $selectStatement;
        } catch (PDOException $exception) {
            throw $exception;
        }
    }

    public function selectPreferredPresentationsForUser(string &$username)
    {
        try {
            $sql = "SELECT presentation.theme, DATE_FORMAT(presentation.presentDate, '%H:%i %d %M %Y') as presentDate,
   						presentation.presenterName, presentation.place,  presentation.groupNumber, 
						presentation.facultyNumber, presentation.dayNumber, userPref.prefType
					FROM  (SELECT preference.presentationTheme as presTheme, preference.preferenceType as prefType
							FROM preference
						    WHERE username=:username) as userPref INNER JOIN presentation ON userPref.presTheme = presentation.theme	";

            $selectStatement = $this->connection->prepare($sql);

            $selectStatement->execute(array("username" => $username));

            return $selectStatement;
        } catch (PDOException $exception) {
            throw $exception;
        }
    }

    public function insertPreference($data)
    {
        try {
            $sql = "INSERT INTO preference (username, presentationTheme, preferenceType) 
					VALUES(:username, :presentationTheme, :preferenceType);";

            $insertStatement = $this->connection->prepare($sql);
            $result = $insertStatement->execute($data);

            return $result;
        } catch (PDOException $exception) {
            throw $exception;
        }
    }

    public function selectNumberOfUsers()
    {
        try {
            $sql = "SELECT COUNT(*) as numberOfUsers FROM user";

            $selectStatement = $this->connection->prepare($sql);
            $selectStatement->execute();

            return $selectStatement;
        } catch (PDOException $exception) {
            throw $exception;
        }
    }

    public function selectNumberOfPresentations()
    {
        try {
            $sql = "SELECT COUNT(*) as numberOfPresentations FROM presentation";

            $selectStatement = $this->connection->prepare($sql);
            $selectStatement->execute();

            return $selectStatement;
        } catch (PDOException $exception) {
            throw $exception;
        }
    }

    public function selectNumberOfPreferences()
    {
        try {
            $sql = "SELECT COUNT(*) as numberOfPreferences FROM preference";

            $selectStatement = $this->connection->prepare($sql);
            $selectStatement->execute();

            return $selectStatement;
        } catch (PDOException $exception) {
            throw $exception;
        }
    }


    public function selectMaxNumberOfAttendancesForAllUser()
    {
        try {
            $sql = " SELECT MAX(t1.userCount) as maxNumberOfPreference
                     FROM (SELECT COUNT(username) as userCount
  	                       FROM preference 
  	                       GROUP BY username ) as t1";

            $selectStatement = $this->connection->prepare($sql);
            $selectStatement->execute();

            return $selectStatement;
        } catch (PDOException $exception) {
            throw $exception;
        }
    }

    public function selectAverageNumberOfPreferences()
    {
        try {
            $sql = " SELECT CAST(AVG(t1.userCount) as INT) as averageNumberOfPreference
                     FROM   (SELECT COUNT(username) as userCount 
                             FROM preference
                             GROUP BY username ) as t1";

            $selectStatement = $this->connection->prepare($sql);
            $selectStatement->execute();

            return $selectStatement;
        } catch (PDOException $exception) {
            throw $exception;
        }
    }

    public function selectMostPreferredPresentation()
    {
        try {
            $sql = "  SELECT MAX(t1.presentationCount) as mostPreferredPresentation
 		              FROM (SELECT COUNT(presentationTheme) as presentationCount, presentationTheme
  	   	                    FROM preference
  	   	                    GROUP BY presentationTheme ) as t1";

            $selectStatement = $this->connection->prepare($sql);
            $selectStatement->execute();

            return $selectStatement;
        } catch (PDOException $exception) {
            throw $exception;
        }
    }


    private function initialize($host, $database, $user, $password)
    {
        try {
            $this->connection = new PDO("mysql:host=$host;dbname=$database", $user, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
        } catch (PDOException $exception) {
            throw $exception;
        }
    }


}

?>