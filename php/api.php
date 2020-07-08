<?php

require_once "user.php";
require_once "presentation.php";
require_once "preference.php";

require_once "register.php";
require_once "login.php";
require_once "logout.php";
require_once "load_schedule.php";
require_once "generate_personal_schedule.php";

start();

function start() {
	session_start();
	header("Content-type: application/json");

	$requestURL = $_SERVER["REQUEST_URI"];

	if (preg_match("/registration$/", $requestURL)) {
		registration();
	}
	elseif (preg_match("/login$/", $requestURL)) {
		login();
	}
	elseif (preg_match("/logout$/", $requestURL)) {
		logout();
	}
	elseif (preg_match("/loadSchedule$/", $requestURL)) {
		loadSchedule();
	}
	elseif (preg_match("/generatePersonalSchedule$/", $requestURL)) {
		generatePersonalSchedule();
	}
	else {
		echo json_encode(["error" => "грешка : не е намерен такъв URL"]);
	}
}

?>