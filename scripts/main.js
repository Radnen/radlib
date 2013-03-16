/**
* Script: main.js
* Written by: Andrew Helenius
* Updated: 3/15/2013
**/

// Require the only script needed to get a radlib game off the ground
RequireScript("radlib/radlib.js");

// automatically load in all of the
// resources to be used by this game:
Resources.loadAll();

// Require the extra radgui library only after resources are loaded in
// This is because the library would make use of those resources.
RequireScript("radgui/radgui.js");

function EmptyState() {
	State.call(this, "Empty");
	
	this.update.add(function() {
		if (Input.onKeyDown(KEY_ESCAPE)) { this.hide(); }
	});
	
	this.render.add(function() {
		Resources.images.libbg.blit(0, 0);
	});
}

function game() {
	Lib.showIntro();

	// show an empty, background state:
	var es = new EmptyState();
	es.show();
	
	// reveal the debug window:
	Debug.open = true;
	
	// start the game up:
	StateManager.execute();
}
