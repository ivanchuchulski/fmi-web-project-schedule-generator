<?php
require_once "register.php";
require_once "login.php";
require_once "logout.php";
require_once "load_schedule.php";
require_once "generate_personal_schedule.php";
require_once "load_personal_schedule.php";
require_once "update_personal_schedule.php";
require_once "export_full_schedule_to_csv.php";
require_once "export_personal_schedule_to_csv.php";
require_once "generate_statistics.php";

class Router
{
	public function performAction($requestURL) {
		header("Content-type: application/json");
		session_start();

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
		elseif (preg_match("/exportFullScheduleToCSV$/", $requestURL)) {
			exportFullScheduleToCSV();
		}
		elseif (preg_match("/exportPersonalScheduleToCSV$/", $requestURL)) {
			exportPersonalScheduleToCSV();
		}
		elseif (preg_match("/statistics$/", $requestURL)) {
			generateStatistics();
		}
		else {
			echo json_encode(["error" => "грешка : не е намерен такъв URL"]);
		}
	}

}