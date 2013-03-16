/**
* Script: slidebar.js
* Written by: Radnen
* Updated: 3/6/2013
**/

function SlideBar(x, y, w, initial, max, min)
{
	Control.call(this, x, y);
	this.w = w + 32;
	
	this.value = initial;
	this.max = max;
	this.min = min || 0;

	this.leftArrow = Resources.images.left_slide;
	this.rightArrow = Resources.images.right_slide;
	this.slide = Resources.images.slide;
	
	this.caption = "";
	
	this.amount = 1;
	
	this.onChange = new Event(this);
}

SlideBar.prototype = new Control();

SlideBar.prototype.draw = function() {
	if (Mouse.within(this.x-2, this.y, 16, 16))
		this.leftArrow.blitMask(this.x, this.y, Colors.yellow);
	else
		this.leftArrow.blit(this.x, this.y);
	
	Lib.drawText(this.x, this.y-16, FormatString(this.caption, this.value));
	Line(this.x+16, this.y+7, this.x+16+this.w, this.y+7, Colors.white);
	Line(this.x+16, this.y+8, this.x+16+this.w, this.y+8, Colors.gray);
	this.slide.blit(this.x + 8 + ((this.value-this.min) / (this.max-this.min)) * (this.w), this.y);
		
	if (Mouse.within(this.x+18+this.w, this.y, 16, 16))
		this.rightArrow.blitMask(this.x+this.w+16, this.y, Colors.yellow);
	else
		this.rightArrow.blit(this.x+16+this.w, this.y);
}

SlideBar.prototype.decrement = function() {
	if (this.value == this.min) return;
	this.value -= this.amount;
	this.onChange.execute();
}

SlideBar.prototype.increment = function() {
	if (this.value == this.max) return;
	this.value += this.amount;
	this.onChange.execute();
}

SlideBar.prototype.update = function() {
	if (Mouse.onDown(MOUSE_LEFT)) {
		if (Mouse.within(this.x, this.y, 16, 16))
			this.decrement();
		if (Mouse.within(this.x+16+this.w, this.y, 16, 16))
			this.increment();
	}
}