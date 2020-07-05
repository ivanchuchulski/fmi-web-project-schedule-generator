(function () {
	let preferenceButtons = document.getElementsByClassName("preferenceButton");

	for (let i = 0; i < preferenceButtons.length; i++) {
		preferenceButtons[i].addEventListener("click", addToPreferences);
	}

	// let willAttend = document.getElementById("willAttend");
	// let couldAttend = document.getElementById("couldAttend");

	// let eventElement = willAttend.parentElement.parentElement;
	// let eventAuthor = eventElement.getElementsByClassName("author");

	// console.log(eventElement);
	// console.log(eventAuthor[0].innerHTML);
})();

function addToPreferences() {
    console.log(this);
    
    // first check if the this button is active
	if (this.classList.contains("active")) {
        removeHightlight(this);
        
        // remove the preference to db
        
		return;
	}

	let preferenceButtons = this.parentElement.getElementsByClassName("preferenceButton");

	for (let i = 0; i < preferenceButtons.length; i++) {
		console.log("button " + preferenceButtons[i]);

		if (preferenceButtons[i].classList.contains("active")) {
            removeHightlight(preferenceButtons[i]);
            
            // remote the preference to db
		}
	}

    addHighlight(this);
    // add the preference to db
}

function addHighlight(preferenceButton) {
	preferenceButton.className += " active";
}

function removeHightlight(preferenceButton) {
	preferenceButton.className = preferenceButton.className.replace(" active", "");
}
