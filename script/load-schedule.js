(function () {
	loadSchedule();
})();

function loadSchedule() {
	document.addEventListener("DOMContentLoaded", function () {
		var calendarElement = document.getElementById("calendar");

		var calendar = new FullCalendar.Calendar(calendarElement, {
			plugins: ["dayGrid", "interaction"],
			height: 650,
			dateClick: function (info) {
				alert("clicked on " + info.dateStr);
			},
		});

		calendar.render();
	});
}
