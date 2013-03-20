/**
* Script: radgui.js
* Written by: Andrew Helenius
* Updated: 3/20/2013
**/

RequireFolder("radgui/ui");
RequireFolder("radgui/state");

var Gui = (function() {
	var author = "Andrew \"Radnen\" Helenius";
	var version = 1.0;
	
	function VersionString() {
		return "Version: " + version + "\nAuthor: " + author;
	}

	return {
		author: author,
		version: version,
		getVersionString: VersionString,
	}
})();

function Draw(e) { e.draw(); }
function Update(t) { t.update(); }

Lib.windowstyle = Resources.windowstyles.rgmain;
Lib.font = Resources.fonts.rgfont;

if (!this.Lib) Abort("RadGui Requires RadLib Library");
Debug.log("Loaded Radgui Library");
