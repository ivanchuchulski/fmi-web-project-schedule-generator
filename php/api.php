<?php

require_once "router.php";

$router = new Router();

$requestURL = $_SERVER["REQUEST_URI"];

$router->performAction($requestURL);

?>