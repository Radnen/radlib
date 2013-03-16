/**
* Script: radlib.js
* Written by: Radnen
* Updated: 3/13/2013
**/

RequireScript("radlib/radextend.js");

// Load the functional library:
RequireScript("radlib/animation.js");
RequireScript("radlib/animator.js");
RequireScript("radlib/assert.js");
RequireScript("radlib/audio.js");
RequireScript("radlib/behaviorcontainer.js");
RequireScript("radlib/behaviors.js");
RequireScript("radlib/colors.js");
RequireScript("radlib/debug.js");
RequireScript("radlib/entity.js");
RequireScript("radlib/event.js");
RequireScript("radlib/game.js");
RequireScript("radlib/hooklist.js");
RequireScript("radlib/inherit.js");
RequireScript("radlib/input.js");
RequireScript("radlib/image.js");
RequireScript("radlib/json2.js");
RequireScript("radlib/list.js");
RequireScript("radlib/mouse.js");
RequireScript("radlib/path.js");
RequireScript("radlib/resources.js");
RequireScript("radlib/savefile.js");
RequireScript("radlib/state.js");
RequireScript("radlib/statemanager.js");
RequireScript("radlib/time.js");
RequireScript("radlib/valuelerper.js");

RequireScript("radlib/persist/persist.js");

var Lib = (function() {
	var author = "Andrew \"Radnen\" Helenius";
	var version = 0.75;
	
	/* Basic, optional intro feature to add to your game. */
	function ShowIntro() {
		var img, t;
		
		img = Resources.images.title;
		if (GetScreenWidth() != 640 && GetScreenHeight() != 480) {		
			img = CreateScaledImage(img, GetScreenWidth(), GetScreenHeight());
		}
		
		t = GetTime();
		while (t + 1000 > GetTime() && !IsAnyKeyPressed()) {
			Resources.images.libbg.blit(0, 0);
			img.blit(0, 0);
			FlipScreen();
		}

		img = Resources.images.sphere;
		if (GetScreenWidth() != 640 && GetScreenHeight() != 480) {		
			img = CreateScaledImage(img, GetScreenWidth(), GetScreenHeight());
		}

		t = GetTime();
		while (t + 1000 > GetTime() && !IsAnyKeyPressed()) {
			Resources.images.libbg.blit(0, 0);
			img.blit(0, 0);
			FlipScreen();
		}
	}
		
	function VersionString() {
		return "Version: " + version + "\nAuthor: " + author;
	}
		
	return {
		/* Package Info: please do not change! */
		author: author,
		version: version,
		
		/* Default System Colors. (You can change them to your liking.) */
		colors: {debugBG1: CreateColor(0, 0, 0),
						 debugBG2: CreateColor(0, 10, 50),
						 debugText: CreateColor(220, 220, 255),
						 error: CreateColor(200, 100, 100),
						 warning: CreateColor(200, 200, 100),
						 good: CreateColor(100, 200, 100)},
		
		/* System Resources: */
		arrow: GetSystemArrow(),
		downArrow: GetSystemDownArrow(),
		font: GetSystemFont(),
		SW: GetScreenWidth(),
		SH: GetScreenHeight(),
		upArrow: GetSystemUpArrow(),
		windowstyle: GetSystemWindowStyle(),
		
		/* Cursor Properties: */
		cursor: null,
		cursorHotspot: {x: 0, y: 0},
		cursorColor: CreateColor(255, 255, 255),
		drawCursor: function() {
			if (!this.cursor) return;
			var x = GetMouseX() - this.cursorHotspot.x;
			var y = GetMouseY() - this.cursorHotspot.y;
			this.cursor.blitMask(x, y, this.cursorColor);
		},
		
		/* System Functions */
		getVersionString: VersionString,
		drawText: function(x, y, text, color) {
			if (!this.font) return;
			var	c = this.font.getColorMask();
			if (color)this.font.setColorMask(color);
			this.font.drawText(x, y, text);
			if (color) this.font.setColorMask(c);
		},

		drawCenteredText: function(x, y, text, color) {
			if (!this.font) return;
			var	c = this.font.getColorMask();
			if (color) this.font.setColorMask(color);
			this.font.drawText(x - this.font.getStringWidth(text)/2, y, text);
			if (color) this.font.setColorMask(c);
		},
		showIntro: ShowIntro,
		lerp: function(A, B, D) { // good place for this??
			return A + (B-A) * D;
		}
	};
})();

Debug.log("Loaded Radlib Library");