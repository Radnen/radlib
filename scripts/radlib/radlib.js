/**
* Script: radlib.js
* Written by: Andrew Helenius
* Updated: 6/30/2013
**/

// Create an access point to the global object from anywhere
var global = this;

// Load the functional library:
RequireScript("radlib/animation.js");
RequireScript("radlib/assert.js");
RequireScript("radlib/audio.js");
RequireScript("radlib/colors.js");
RequireScript("radlib/debug.js");
RequireScript("radlib/event.js");
RequireScript("radlib/game.js");
RequireScript("radlib/hooklist.js");
RequireScript("radlib/inherit.js");
RequireScript("radlib/input.js");
RequireScript("radlib/image.js");
RequireScript("radlib/json2.js");
RequireScript("radlib/list.js");
RequireScript("radlib/loader.js");
RequireScript("radlib/mouse.js");
RequireScript("radlib/path.js");
RequireScript("radlib/radextend.js");
RequireScript("radlib/random.js");
RequireScript("radlib/resources.js");
RequireScript("radlib/savefile.js");
RequireScript("radlib/state.js");
RequireScript("radlib/statemanager.js");
RequireScript("radlib/timer.js");
RequireScript("radlib/tween.js");

var Lib = (function() {
    var author = "Andrew \"Radnen\" Helenius";
    var version = 0.80;
	
	if (GetVersion() < 1.5) Abort("Need Sphere version 1.5 and up to function correctly.");
    
    /* Basic, optional intro feature to add to your game. */
    function ShowIntro() {
        var img, t, col = CreateColor(255, 255, 255, 0);
		var tween = new Tween();
        
        img = Resources.images.radlib;
        if (GetScreenWidth() != 640 && GetScreenHeight() != 480) {      
            img = CreateScaledImage(img, GetScreenWidth(), GetScreenHeight());
        }
        
		tween.setup(0, 255, 1000);
        t = GetTime();
        while (t + 1500 > GetTime() && !IsAnyKeyPressed()) {
			tween.update();
			col.alpha = tween.value;
            Resources.images.libbg.blit(0, 0);
            img.blitMask(0, 0, col);
            FlipScreen();
        }
		
		tween.setup(255, 0, 500);
		while (tween.update()) {
			col.alpha = tween.value;
            Resources.images.libbg.blit(0, 0);
            img.blitMask(0, 0, col);
            FlipScreen();
		}

		if (GetVersion() == 1.5) img = Resources.images.sphere15;
		if (GetVersion() == 1.6) img = Resources.images.sphere16;
		
        if (GetScreenWidth() != 640 && GetScreenHeight() != 480) {      
            img = CreateScaledImage(img, GetScreenWidth(), GetScreenHeight());
        }

		tween.setup(0, 255, 1000);
        t = GetTime();
        while (t + 1500 > GetTime() && !IsAnyKeyPressed()) {
			tween.update();
			col.alpha = tween.value;
            Resources.images.libbg.blit(0, 0);
            img.blitMask(0, 0, col);
            FlipScreen();
        }

		tween.setup(255, 0, 500);
		while (tween.update()) {
			col.alpha = tween.value;
            Resources.images.libbg.blit(0, 0);
            img.blitMask(0, 0, col);
            FlipScreen();
		}
		
		tween.setup(255, 0, 500);
		while (tween.update()) {
			col.alpha = tween.value;
            Resources.images.libbg.blitMask(0, 0, col);
            FlipScreen();
		}
    }
        
    function VersionString() {
        return "Version: " + version + "\nAuthor: " + author;
    }
        
    return {
        get author() { return author; },
        get version() { return version; },
        
        /* Default System Colors. (You can change them to your liking.) */
        colors: {debugBG1: CreateColor(0, 0, 0),
                         debugBG2: CreateColor(0, 10, 50),
                         debugText: CreateColor(220, 220, 255),
                         error: CreateColor(200, 100, 100),
                         warning: CreateColor(200, 200, 100),
                         good: CreateColor(100, 200, 100)},
        
        /* System Resources: */
        arrow: LoadImage("RadLib/arrow.png"),
        cursor: null,
        downArrow: GetSystemDownArrow(),
        font: GetSystemFont(),
        SW: GetScreenWidth(),
        SH: GetScreenHeight(),
        upArrow: GetSystemUpArrow(),
        windowstyle: GetSystemWindowStyle(),
                
        /* System Functions */
        getVersionString: VersionString,
        drawText: function(x, y, text, color) {
            if (!this.font) return;
            var c = this.font.getColorMask();
            if (color)this.font.setColorMask(color);
            this.font.drawText(x, y, text);
            if (color) this.font.setColorMask(c);
        },

        drawCenteredText: function(x, y, text, color) {
            if (!this.font) return;
            var c = this.font.getColorMask();
            if (color) this.font.setColorMask(color);
            this.font.drawText(x - this.font.getStringWidth(text)/2, y, text);
            if (color) this.font.setColorMask(c);
        },
        showIntro: ShowIntro

    };
})();

Debug.log("Loaded Radlib Library");
