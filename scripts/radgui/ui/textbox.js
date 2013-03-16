/**
* Script: textbox.js
* Written by: Radnen
* Updated: 3/13/2013
**/

function TextBox(x, y, w, h, text)
{
	Control.call(this, x, y, w, h);
	
	this.window    = true;
	this.text      = text;
	this.y_offset  = 0;
	
	this.lines = Lib.font.wordWrapString(text, w - 20);
	this.virtual_h = this.lines.length * 16;
	
	this.up = this.dn = false;
	this.showbar = this.virtual_h > this.h;
}

TextBox.prototype = new Control();

TextBox.prototype.increment = function() {
	if (this.y_offset == 0) return;
	this.y_offset--;
}

TextBox.prototype.decrement = function() {
	if (this.y_offset == Math.max(0, Math.floor((this.virtual_h - this.h) / 16))) return;
	this.y_offset++;
}

TextBox.prototype.update = function() {
	if (!this.showbar) return;
	
	this.up = Mouse.within(this.right - 16, this.top, 16, 16);
	if (this.up && Mouse.onDown(MOUSE_LEFT)) this.increment();

	this.dn = Mouse.within(this.right - 16, this.bottom - 16, 16, 16);
	if (this.dn && Mouse.onDown(MOUSE_LEFT)) this.decrement();
}

TextBox.prototype.draw = function() {
	if (this.window) Lib.windowstyle.drawWindow(this.x, this.y, this.w, this.h);
	
	if (this.showbar) {
		Line(this.right - 17, this.top, this.right - 17, this.bottom, Colors.gray);
		
		Lib.upArrow.blitMask(this.right - 16, this.top, this.up ? Colors.yellow : Colors.white);
		Lib.downArrow.blitMask(this.right - 16, this.bottom - 16, this.dn ? Colors.yellow : Colors.white);

		Line(this.right-9, this.top+17, this.right-9, this.bottom-17, Colors.white);
		Line(this.right-8, this.top+17, this.right-8, this.bottom-17, Colors.gray);

		var maxoffset = Math.max(1, Math.floor((this.virtual_h - this.h) / 16));
		Resources.images.slide.blit(this.right - 16, this.top + 16 + this.y_offset / maxoffset * (this.h - 48));
	}
	
	SetClippingRectangle(this.x, this.y, this.w, this.h);
	for (var i = 0; i < this.lines.length; ++i) {
		Lib.font.drawText(this.x+2, this.y+i*16 - this.y_offset * 16, this.lines[i]);
	}
	SetClippingRectangle(0, 0, Lib.SW, Lib.SH);
}