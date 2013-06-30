/**
* Script: camera.js
* Written by: Radnen
* Updated: 6/23/2013
**/

/**
* Custom Camera Control
*  - Used in lieu of AttachCamera(name);
*  - Supports panning options;
*  - Supports screen offsets;
*  - Supports earthquake mode; <-- (WIP)
**/

const CAM_IMMEDIATE = 0;
const CAM_FOLLOW = 1;
//const CAM_DELAY = 2
const CAM_NONE = 3

var Camera = ({
	x: 0,
	xoff: 0,
	y: 0,
	yoff: 0,
	input: null,
	done: false,
	x_pan: new Tween(),
	y_pan: new Tween(),
	followX: new Tween(),
	followY: new Tween(),
	ftime: 0,
	fdelay: 100,
	panning: false,
	style: CAM_FOLLOW,

	/**
	* attach(name);
	*  - attaches camera to person named 'name'.
	**/
	attach: function(name) {
		if (!DoesPersonExist(name)) { Debug.log("Person {?} doesn't exist!", name, LIB_WARN); return; }
		this.input = name;
		if (IsMapEngineRunning()) this.setXY(GetPersonX(name) + this.xoff, GetPersonY(name) + this.yoff);
		this.followX.setValue(this.x);
		this.followY.setValue(this.y);
		this.panning = false;
	},
	
	/**
	* detatch();
	*  - releases camera from attached entity.
	**/
	detach: function() {
		this.input = null;
	},
	
	/* Same as detach, but better worded */
	release: function() {
		this.input = null;
	},
	
	/**
	* pan(x, y, msecs);
	*  - pans the camera to location ('x', 'y') in 'msecs' milliseconds.
	**/
	pan: function(x, y, msecs, wait) {
		this.done = false;
		this.input = null;
		this.x_pan.setup(this.x, x, msecs, Tweens.sine);
		this.y_pan.setup(this.y, y, msecs, Tweens.sine);
		this.panning = true;
		if (wait) this.waitForMe();
	},
	
	/**
	* panToTile(x, y, msecs);
	*  - same as pan, but with regard to tile coords.
	**/
	panToTile: function(x, y, msecs, wait) {
		this.pan(x * GetTileWidth(), y * GetTileHeight(), msecs, wait);
	},
	
	forceFinish: function() {
		this.x_pan.forceFinish();
		this.y_pan.forceFinish();
		this.setXY(this.x_pan.value, this.y_pan.value);
		this.panning = false;
		this.done = true;
	},
	
	/**
	* update();
	*  - Goes in an update script.
	**/
	update: function() {
		var t = GetTime();
		if (this.input != null) {
			this.done = true;
			
			if (this.style == CAM_FOLLOW) {
				if (this.ftime + this.fdelay < GetTime()) {
					this.followX.setup(this.x, GetPersonX(this.input) + this.xoff, 500);
					this.followY.setup(this.y, GetPersonY(this.input) + this.yoff, 500);
					this.ftime = GetTime();
				}
				
				this.followX.update();
				this.followY.update();
				this.setXY(this.followX.value, this.followY.value);
			}
			else if (this.style == CAM_IMMEDIATE) this.setXY(GetPersonX(this.input), GetPersonY(this.input));
		}
		else if (this.panning) {
			this.x_pan.update();
			this.y_pan.update();
			this.setXY(this.x_pan.value, this.y_pan.value);
			this.done = this.x_pan.isFinished() && this.y_pan.isFinished();
			if (this.done) this.panning = false;
		}
	},
	
	/**
	* snapToInput();
	*  - from wherever it is, recenter it on the input. It will do nothing if no input was set.
	**/
	snapToInput: function() {
		if (!this.input) return;
		this.setXY(GetPersonX(this.input), GetPersonY(this.input));
		this.followX.setValue(this.x);
		this.followY.setValue(this.y);
	},
	
	/**
	* panToPerson(name, msecs [, wait]);
	*  - pans the camera to entity 'name's position in 'msecs' milliseconds,
	*		 optionally set to wait or not. 
	**/
	panToPerson: function(name, msecs, wait) {
		if (!DoesPersonExist(name)) { Debug.log("Person {?} doesn't exist!", name, LIB_WARN); return; }
		this.pan(GetPersonX(name), GetPersonY(name), msecs, wait);
	},
		
	/**
	* setXY(x, y);
	*  - sets the cameras x and y pixel position.
	**/
	setXY: function(x, y) {
		SetCameraX(x);
		SetCameraY(y);
		this.x = x;
		this.y = y;
	},
	
	/**
	* waitForMe();
	*  - waits for the camera to finish by only updating the map engine while its moving.
	**/
	waitForMe: function() {
		var LastFr = GetFrameRate();
		SetFrameRate(GetMapEngineFrameRate());
		while(!this.done) {
			UpdateMapEngine();
			RenderMap();
			this.update();
			FlipScreen();
		}
		SetFrameRate(LastFr);
	},
	
	/* returns x coord */
	getX: function() {
		return this.x + this.xoff;
	},
	
	/* returns y coord */
	getY: function() {
		return this.y + this.yoff;
	}
});