(function () {
	let preferences = [];

	let preferenceButtons = document.getElementsByClassName("preferenceButton");

	for (let i = 0; i < preferenceButtons.length; i++) {
		preferenceButtons[i].addEventListener("click", addToPreferences);
	}

})();

// maybe not directly write to db when manipulating preferences, but add them to some list 
// which is passed as parameter, and at clicking on 'generate personal' pass the list at once
function addToPreferences() {
	const ACITVE_CLASSNAME = "active";

	// first check if the this button is active
	if (this.classList.contains("active")) {
        removeHightlight(this);
		
		generatePreferenceDetails(this);
		// remove the preference to db, or pass boolean to the call above(better not to do that, SRP)
		// make this method it a promise and return the button and boolean to indicate the action?
		// https://stackoverflow.com/a/14220323
        
		return;
	}


	// if its not, then find its active sibiling and remove it 
	let preferenceButtons = this.parentElement.getElementsByClassName("preferenceButton");

	for (let i = 0; i < preferenceButtons.length; i++) {
		if (preferenceButtons[i].classList.contains("active")) {
            removeHightlight(preferenceButtons[i]);
            generatePreferenceDetails(preferenceButtons[i]);
            // remove the preference to db
		}
	}

	addHighlight(this);
	generatePreferenceDetails(this);
    // add the preference to db
}

function addHighlight(preferenceButton) {
	preferenceButton.className += " active";
}

function removeHightlight(preferenceButton) {
	preferenceButton.className = preferenceButton.className.replace(" active", "");
}

// if this method is used to define a query to db, then the author name and theme name 
// could be used to join the two tables
function generatePreferenceDetails(preferenceButton) {
	const PRESENTER_CLASSNAME = "presenter";
	const THEME_CLASSNAME = "theme";

	let event = preferenceButton.parentElement.parentElement;
	
	let preferenceObj = {
		presenter : event.getElementsByClassName(PRESENTER_CLASSNAME)[0].innerHTML,
		theme : event.getElementsByClassName(THEME_CLASSNAME)[0].innerHTML,
		preference : preferenceButton.innerHTML
	}

	console.log("event : " + preferenceObj.presenter);
	console.log("theme : " + preferenceObj.theme);
	console.log("preference : " + preferenceObj.preference);
}