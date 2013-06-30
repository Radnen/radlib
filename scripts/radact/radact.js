/**
* Script: radact.js
* Written by: Andrew Helenius
* Updated: 6/30/2013
**/

RequireScript("radact/animator.js");
RequireScript("radact/behaviorcontainer.js");
RequireScript("radact/behaviors.js");
RequireScript("radact/entity.js");
RequireScript("radact/eventmanager.js");
RequireScript("radact/pathing.js");

var Act = (function() {
	var author = "Andrew \"Radnen\" Helenius";
	var version = 0.25;
	
	function VersionString() {
		return "Version: " + version + "\nAuthor: " + author;
	}

	return {
		get author() { return author; },
		get version() { return version; },
		getVersionString: VersionString
	}
})();

if (!this.Lib) Abort("RadAct Requires RadLib Library");
Debug.log("Loaded Radact Library");
