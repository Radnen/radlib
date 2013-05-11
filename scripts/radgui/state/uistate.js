/**
* Script: uistate.js
* Written by: Andrew Helenius
* Updated: 5/10/2013
**/

function UIState(name, x, y, w, h)
{
	State.call(this, name);
	
	this.x = x || 0;
	this.y = y || 0;
	this.w = w || 0;
	this.h = h || 0;
	
	this.window   = false;
	this.controls = new ControlHolder();
	
	/* Graphical vertical growth/shrink feature. */
	this.closed = false;
	this.vert   = false;
	this.wind_h = new Tween();
	this.horiz  = false;
	this.wind_w = new Tween();
	
	this.growVert = function(time) {
		if (!time) time = 250;
		this.vert = true;
		this.wind_h.setup(0, this.h, time);
		this.closed = true;
	}
	
	this.shrinkVert = function(time) {
		if (!time) time = 250;
		this.vert = true;
		this.wind_h.setup(this.h, 0, time);
		this.closed = true;
	}

	this.growHoriz = function(time) {
		if (!time) time = 250;
		this.horiz = true;
		this.wind_w.setup(0, this.w, time);
		this.closed = true;
	}
	
	this.shrinkHoriz = function(time) {
		if (!time) time = 250;
		this.horiz = true;
		this.wind_w.setup(this.w, 0, time);
		this.closed = true;
	}
	
	this.onInput = function(key) { this.controls.onInput(key); }
	
	this.update.add(function() {
		if (this.vert) {
			if (!this.wind_h.update() && this.wind_h.to > 0) this.closed = false;
		}
		if (this.horiz) {
			if (!this.wind_w.update() && this.wind_w.to > 0) this.closed = false;
		}
		this.controls.update();
	});
	
	this.render.add(function() {
		if (this.window) {
			var x = this.x, y = this.y, w = this.w, h = this.h;
			
			if (this.vert) {
				h = this.wind_h.value;
				y = (this.y + this.h/2) - h/2;
			}
			
			if (this.horiz) {
				w = this.wind_w.value;
				x = (this.x + this.w/2) - w/2;
			}
			
			Lib.windowstyle.drawWindow(x, y, w, h);
		}
		if (!this.closed) this.controls.render();
	});
}