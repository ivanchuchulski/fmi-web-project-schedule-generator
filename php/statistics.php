<?php
require_once "database.php";

class Statistics
{
    private $database;

    public function __construct()
    {
        $this->database = new Database();
    }

    private function getNumberOfUsers()
    {
        $query = $this->database->selectNumberOfUsers();
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    private function getNumberOfPresentations()
    {
        $query = $this->database->selectNumberOfPresentations();
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    private function getNumberOfAttendances()
    {
        $query = $this->database->selectNumberOfAttendances();
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    private function getMaxNumberOfAttendance()
    {
        $query = $this->database->selectNumberOfUsers();
        return $query->fetch(PDO::FETCH_ASSOC);
    }
//
//    private function getAverageNumberOfAttendance()
//    {
//        $query = $this->database->selectNumberOfUsers();
//        return $query->fetch(PDO::FETCH_ASSOC);
//    }
//
//    private function getMostPopularPresentation()
//    {
//        $query = $this->database->selectNumberOfUsers();
//        return $query->fetch(PDO::FETCH_ASSOC);
//    }
}

?>
