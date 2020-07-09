<?php

require_once "user.php";
require_once "presentation.php";
require_once "preference.php";

require_once "register.php";
require_once "login.php";
require_once "logout.php";
require_once "load_schedule.php";
require_once "generate_personal_schedule.php";
require_once "load_personal_schedule.php";
require_once "updatePersonalSchedule.php";
require_once "export_schedule_in_pdf.php";

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
	//	this returns the personal schedule for logged user to the front-end to be rendered
	elseif (preg_match("/loadPersonalSchedule$/", $requestURL)) {
		loadPersonalSchedule();
	}
	elseif (preg_match("/updatePersonalSchedule$/", $requestURL)) {
		updatePersonalSchedule();
	}
	elseif (preg_match("/exportScheduleInPdf$/", $requestURL)) {
		exportScheduleInPdf();
	}
	else {
		echo json_encode(["error" => "грешка : не е намерен такъв URL"]);
	}

}

?>