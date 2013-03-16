/**
* Script: inputbox.js
* Written by: Radnen
* Updated: 2/24/2013
**/

function InputBox(x, y, width, centered)
{
	Control.call(this, x, y);
	this.text     = "";
	this.caption  = "";
	this.width    = width;
	this.height   = Lib.font.getHeight();
	this.centered = centered || false;
	
	this.onOkay = new Event(this);
}

InputBox.prototype = new Control();

InputBox.prototype.onInput = function(key) {
	switch (key) {
		case KEY_ENTER: this.onOkay.execute(); break;
		case KEY_BACKSPACE: this.text = this.text.substring(0, this.text.length-1); break;
		default:
			var ch = GetKeyString(key, IsKeyPressed(KEY_SHIFT));
			if (Lib.font.getStringWidth(this.text + ch) < this.width-4) {
				this.text += ch;
			}
		break;
	}
}

InputBox.prototype.draw = function() {
	var x = this.x - ((this.centered) ? this.width / 2 : 0);
	var y = this.y - ((this.centered) ? this.height / 2 : 0);
	
	Lib.windowstyle.drawWindow(x, y, this.width, this.height);
	Lib.font.drawText(x+2, y, this.text);
	Lib.font.drawText(x, y-this.height-2, this.caption);
	
	var t = new Date();
	if (t.getMilliseconds() > 500) {
		Lib.font.drawText(x + Lib.font.getStringWidth(this.text), y, "|");
	}
}