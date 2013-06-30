/**
* Script: screen.js
* Written by: Radnen
* Updated: 5/15/2013
**/

// I offer a night/morning time values to use in the engine //
const NIGHT = CreateColor(10, 10, 40, 125);
const MORNING = CreateColor(255, 230, 180, 32);

// This is the engine, a game will typically consist of 1 engine //
// A second engine may be used separately for day/night however //
var Screen = ({
	color: CreateColor(0, 0, 0, 0),
	ticks: 0,
	max: 255,
	images: [],
	done: false,
	fade: new Tween(),

	addImage: function(dynaimage) {
		this.images.push(dynaimage);
	},
	
	// Call this whenever you want to fade the screen in //
	fadeIn: function(msecs, wait) {
		this.color.alpha = this.max;
		this.fade.setup(this.max, 0, msecs, Tweens.quad);
		this.done = false;
		if (wait) this.waitForMe();
	},

	// Call this whenever you want to fade the screen out //
	fadeOut: function(msecs, wait) {
		this.color.alpha = 0;
		this.fade.setup(0, this.max, msecs, Tweens.quad);
		this.done = false;
		if (wait) this.waitForMe();
	},

	// Call this whenever you want to immediately stop a fade or clear the screen from a fade out //
	clear: function() {
		this.fade.setup(this.fade.value, 0, 250, Tweens.quad);
	},
	
	purge: function() {
		this.clear();
		this.images = [];
	},

	// Used to finish a fade immediately. Useful for long fades that can be player skipped(?).
	forceFinish: function() {
		this.fade.forceFinish();
		this.done = true;
		this.color.alpha = this.fade.value;
		ApplyColorMask(this.color);
	},

	// Use this to set the fade color.
	setColor: function(color) {
		this.color.red   = color.red;
		this.color.green = color.green;
		this.color.blue  = color.blue;
	},

	waitForMe: function() {
		var lastFR = GetFrameRate();
		SetFrameRate(GetMapEngineFrameRate());
		while(!this.done) {
			RenderMap();
			UpdateMapEngine();
			FlipScreen();
		}
		SetFrameRate(lastFR);
	},
	
	// This is put inside a RenderScript();
	render: function() {
		if (this.color.alpha != 0) ApplyColorMask(this.color);

		List.foreach(this.images, function(img) { img.updateBlit(); });
		
		this.done = !this.fade.update();
		this.color.alpha = this.fade.value;
	}
});