/**
* Script: ItemList.js
* Written by: Radnen
* Updated: 3/6/2013
**/

function ItemList(x, y, w, cur)
{
	Control.call(this, x, y);
	this.w = w;
	this.items = [];
	this.current = cur || 0;
	this.h = 16;
	this.inLeft = this.inRight = false;
	this.onChange = new Event(this);
	this.caption = "";
}

ItemList.prototype = new Control();

ItemList.prototype.addItem = function(name, call, owner) {
	this.items.push({ name: name, call: call, owner: owner });
}

ItemList.prototype.decrement = function() {
	this.current--;
	if (this.current == -1) this.current = this.items.length - 1;
	this.onChange.execute();
}

ItemList.prototype.increment = function() {
	this.current++;
	if (this.current == this.items.length) this.current = 0;
	this.onChange.execute();
}

ItemList.prototype.update = function() {
	this.inLeft = Mouse.within(this.x, this.y, 16, 16);
	this.inRight = Mouse.within(this.x + this.w, this.y, 16, 16);
	
	if (this.inLeft && Mouse.onDown(MOUSE_LEFT)) this.decrement();
	if (this.inRight && Mouse.onDown(MOUSE_LEFT)) this.increment();
}

ItemList.prototype.draw = function() {
	Lib.drawText(this.x, this.y-20, this.caption);
	
	Lib.windowstyle.drawWindow(this.x, this.y, this.w+16, this.h);
	Lib.windowstyle.drawWindow(this.x + this.w, this.y, 16, 16);
	Lib.windowstyle.drawWindow(this.x, this.y, 16, 16);
	Lib.drawText(this.x+22, this.y, this.items[this.current].name);

	var color1 = this.inLeft ? Colors.yellow : Colors.white;
	var color2 = this.inRight ? Colors.yellow : Colors.white;
	Resources.images.left_slide.blitMask(this.x, this.y, color1);
	Resources.images.right_slide.blitMask(this.x + this.w, this.y, color2);
}