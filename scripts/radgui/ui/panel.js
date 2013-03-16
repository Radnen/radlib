/**
* Script: panel.js
* Written by: Radnen
* Updated: 3/6/2013
**/

function Panel(x, y, w, h)
{
	Control.call(this, x, y, w, h);
	this.controls = [];
	
	this.vh = 0;
}

Panel.prototype = new Control();

Panel.prototype.add = function(ctrl) {
	if (!ctrl instanceof Control) {
		Debug.log("Non-control being added to panel.", LIB_ERROR);
		ctrl = new Control();
	}
	
	this.controls.push(ctrl);
	this.vh = Math.max(this.vh, ctrl.y + ctrl.h);
}

Panel.prototype.update = function() {
	List.foreach(this.controls, Update);
}

Panel.prototype.draw = function(x, y) {
	if (this.window) Lib.windowstyle.drawWindow(x, y, w, h);
	SetClippingRectangle(x, y, w, h);
	
	for (var i = 0; i < this.controls.length; ++i) {
		this.controls[i].draw(x, y);
	}

	SetClippingRectangle(0, 0, Lib.SW, Lib.SH);
}