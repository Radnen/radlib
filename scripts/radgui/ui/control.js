/**
* Script: control.js
* Written by: Radnen
* Updated: 3/6/2013
**/

function Control(x, y, w, h)
{
	this.x = x;
	this.y = y;
	this.w = w || 0;
	this.h = h || 0;
	
	this.enabled = true;
	this.active = true;
}

Control.prototype = {
	get top()    { return this.y;          },
	get bottom() { return this.y + this.h; },
	get left()   { return this.x;          },
	get right()  { return this.x + this.w; }
}

Control.prototype.mouseIn = function() {
	return Mouse.within(this.x, this.y, this.w, this.h);
}

Control.prototype.update = function() { }
Control.prototype.draw = function() { }
Control.prototype.onInput = function() { }

function ControlHolder()
{
	this.controls = [];
}

ControlHolder.prototype.onInput = function(key) {
	var i = this.controls.length;
	while(i--) { this.controls[i].onInput(key); }
}

ControlHolder.prototype.update = function() {
	List.foreach(this.controls, Update);
}

ControlHolder.prototype.render = function() {
	List.foreach(this.controls, Draw);
}

ControlHolder.prototype.add = function(ctrl) {
	if (!ctrl instanceof Control) {
		Debug.log("Added control not of type 'Control'.", LIB_ERROR);
		ctrl = new Control();
	}
	this.controls.push(ctrl);
}