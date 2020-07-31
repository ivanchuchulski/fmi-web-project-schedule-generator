<?php

require_once "interactor.php";

$interactor = new Interactor();

$requestURL = $_SERVER["REQUEST_URI"];

$interactor->performAction($requestURL);

?>