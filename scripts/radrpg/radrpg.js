/**
* Script: radrpg.js
* Written by: Andrew Helenius
* Updated: 6/30/2013
**/

/**
* Core RPG game library.
*  - this library offers objects usually
*    seen in most rpgs such as heros, stats
*    items and enemies.
*  - You may add either the turn based
*    battle system or action battle system
*    addon, they work with this core library.
**/

// Load the handler for RPG games:
RequireScript("RadRpg/clock.js");
RequireScript("RadRpg/rpghandler.js");

// Load core files:
RequireScript("RadRpg/analogue.js");
RequireScript("RadRpg/camera.js");
RequireScript("RadRpg/stat.js");
RequireScript("RadRpg/hero.js");
RequireScript("RadRpg/items.js");
RequireScript("RadRpg/locationbar.js");
RequireScript("RadRpg/overlay.js");
RequireScript("RadRpg/pathing.js");
RequireScript("RadRpg/people.js");
RequireScript("RadRpg/questsys.js");
RequireScript("RadRpg/teleport.js");

var Rpg = (function() {
	var author = "Andrew \"Radnen\" Helenius";
	var version = 0.75;
	
	function VersionString() {
		return "Version: " + version + "\nAuthor: " + author;
	}

	return {
		get author() { return author; },
		get version() { return version; },
		getVersionString: VersionString
	}
})();

// sets the generic hero object to a radrpg hero:
Game.player = new Hero();

if (!this.Lib) Abort("RadRpg Requires RadLib Library");
Debug.log("Loaded Radrpg Library");