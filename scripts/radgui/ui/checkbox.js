/**
* Script: checkbox.js
* Written by: Radnen
* Updated: 3/6/2013
**/

function CheckBox(x, y, text)
{
	Control.call(this, x, y);
	
	this.w = 16+Lib.font.getStringWidth(text);
	this.h = 16;
	this.text = text;
	this.checked = false;
	this.hovered = false;
	
	this.check = Resources.images.check;
}

CheckBox.prototype = new Control();

CheckBox.prototype.update = function() {
	this.hovered = this.mouseIn()
	if (this.hovered && Mouse.onDown(MOUSE_LEFT)) this.checked = !this.checked;
}

CheckBox.prototype.draw = function() {
	this.check.blitMask(this.x, this.y, this.hovered ? Colors.cyan : Colors.white);
	
	if (this.checked)
		Rectangle(this.x + 4, this.y + 4, 8, 8, Colors.green);

	Lib.drawText(this.x+18, this.y, this.text, this.hovered ? Colors.yellow : Colors.white);
}