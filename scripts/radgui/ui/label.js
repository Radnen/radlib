/**
* Script: label.js
* Written by: Radnen
* Updated: 3/15/2013
**/

function Label(x, y, text, w)
{
	Control.call(this, x, y);
	
	this.text = text;
	this.w = w || Lib.font.getStringWidth(text);
	this.w += 4;
	this.h = Lib.font.getHeight();
	
	this.image = null;

	this.window = true;
	this.fixedWidth = false;
	this.color = Colors.white;
	this.values = []; // values for formatting.
}

Label.prototype = new Control();

Label.prototype.formatText = function() {
	this.text = FormatString.apply(null, arguments);
	
	if (!this.fixedWidth)
		this.w  = Lib.font.getStringWidth(this.text) + 4;
}

Label.prototype.draw = function() {
	if (this.window)
		Lib.windowstyle.drawWindow(this.x, this.y, this.w, this.h);
	
	if (this.image) {
		this.image.blit(this.x, this.y);
		Lib.drawText(this.x + this.image.width + 2, this.y, this.text, this.color);
	}
	else {
		Lib.drawText(this.x + 2, this.y, this.text, this.color);
	}
}