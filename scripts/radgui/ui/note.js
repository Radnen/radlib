/**
* Script: note.js
* Written by: Radnen
* Updated: 2/25/2013
**/

function Note(x, y, text, multiline, width)
{
	Control.call(this, x, y);
	
	var multi = false;
	this.__defineGetter__("multiline", function() { return multi; });
	this.__defineSetter__("multiline", function(v) {
		multi = v;
		if (multi) this.updateLines();
		else this.h = Lib.font.getHeight();
	});
	
	this.multiline = multiline;
	
	this.text = text || "";
	this.strings = [];
		
	this.w = multiline ? width : Lib.font.getStringWidth(this.text) + 4;
	this.h = Lib.font.getHeight();
}

Note.prototype = new Control();

Note.prototype.formatText = function() {
	this.text = FormatString.apply(null, arguments);
	
	var t = this.multiline;
	if (!t)
		this.w = Lib.font.getStringWidth(this.text) + 4;
	else
		this.updateLines();
}

Note.prototype.updateLines = function() {
	this.strings = Lib.font.wordWrapString(this.text, this.w - 4);
	this.h = this.strings.length * 16;
}

Note.prototype.setXY = function(x, y) {
	this.x = Math.max(0, Math.min(x, Lib.SW-this.w-4));
	this.y = Math.max(0, Math.min(y, Lib.SH-this.h-4));
}

Note.prototype.draw = function() {
	Lib.windowstyle.drawWindow(this.x, this.y, this.w, this.h);
	if (!this.multiline)
		Lib.drawText(this.x+2, this.y, this.text);
	else {
		List.foreach(this.strings, function(str, i) {
			Lib.drawText(this.x+2, this.y+i*16, str);
		}, this);
	}
}