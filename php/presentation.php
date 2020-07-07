<?php
require_once "database.php";

class Presentation
{
    private $database;

    public function __construct()
    {
        $this->database = new Database();
    }

    public function addPresentationData(array &$presentationDetails)
    {
        $query = $this->database->insertPresentation($presentationDetails);

        if (!$query) {
            throw new Exception("error : insert presentation failed");
        }
    }


    public function presentationExists(array& $presentationTheme)
    {
        $presentation = $this->selectPresentationByTheme($presentationTheme['theme']);

        //    var_dump($user); echo '<br>';

        if (empty($presentation)) {
//            throw new Exception('грешка : вече съществува такава презентация');
            return false;
        }
        return true;
    }

    private function selectPresentationByTheme($presentationTheme)
    {
        $query = $this->database->selectPresentationByTheme($presentationTheme);

        return $query->fetch(PDO::FETCH_ASSOC);
    }
}

?>