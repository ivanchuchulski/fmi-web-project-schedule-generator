<?php
require_once "database.php";

class Statistics
{
    private $database;

    public function __construct()
    {
        $this->database = new Database();
    }

    public function getNumberOfUsers()
    {
        $query = $this->database->selectNumberOfUsers();
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function getNumberOfPresentations()
    {
        $query = $this->database->selectNumberOfPresentations();
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function getNumberOfPreferences()
    {
        $query = $this->database->selectNumberOfPreferences();
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function getMaxNumberOfPreferencesFromAllUsers()
    {
        $query = $this->database->selectMaxNumberOfAttendancesForAllUser();
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function getAverageNumberOfPreferences()
    {
        $query = $this->database->selectAverageNumberOfPreferences();
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function getMostPreferredPresentation()
    {
        $query = $this->database->selectMostPreferredPresentation();
        return $query->fetch(PDO::FETCH_ASSOC);
    }
}

?>
