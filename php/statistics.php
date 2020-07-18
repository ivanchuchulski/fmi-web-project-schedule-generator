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

    public function getNumberOfAttendances()
    {
        $query = $this->database->selectNumberOfAttendances();
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function getMaxNumberOfAttendance()
    {
        $query = $this->database->selectNumberOfUsers();
        return $query->fetch(PDO::FETCH_ASSOC);
    }
//
//    public function getAverageNumberOfAttendance()
//    {
//        $query = $this->database->selectNumberOfUsers();
//        return $query->fetch(PDO::FETCH_ASSOC);
//    }
//
//    public function getMostPopularPresentation()
//    {
//        $query = $this->database->selectNumberOfUsers();
//        return $query->fetch(PDO::FETCH_ASSOC);
//    }
}

?>
