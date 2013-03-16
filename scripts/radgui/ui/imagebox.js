/**
* Script: imagebox.js
* Written by: Radnen
* Updated: 3/15/2013
**/

function ImageBox(x, y, image)
{
	Control.call(this, x, y);
	this.window = false;
	this.image = image;
}

ImageBox.prototype = new Control();

ImageBox.prototype.draw = function() {
	if (this.window)
		Lib.windowstyle.drawWindow(this.x, this.y, this.image.width, this.image.height);
		
	this.image.blit(this.x, this.y);
}