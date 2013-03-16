/**
* Script: scrolllist.js
* Written by: Radnen
* Updated: 3/6/2013
**/

function ScrollList(x, y, w, h)
{
	Control.call(this, x, y, w, h);
	
	this.items = [];
	this.index = 0;
	this.hoverColor = CreateColor(50, 50, 250);
	this.showBar = false;
	this.shown = 0;
	this.offset = 0;
	
	this.onClick = new Event(this);
	this.onDoubleClick = new Event(this);
	this.up = this.dn = false;
}

ScrollList.prototype = new Control();

ScrollList.prototype.increment = function() {
	if (this.offset > 0) this.offset--;
}

ScrollList.prototype.decrement = function() {
	if (this.offset < this.items.length - this.shown + 1) this.offset++;
}

ScrollList.prototype.addItem = function(text, color, image) {
	if (!color) color = Colors.white;
	this.items.push({text: text, color: color, image: image});
	
	this.shown   = Math.floor(this.h / 16);
	this.showBar = this.items.length > this.shown;
}

ScrollList.prototype.update = function() {
	this.index = -1;
	var max = (this.shown < this.items.length) ? this.shown : this.items.length
	
	for (var i = 0; i < max; ++i) {
		if (i + this.offset >= this.items.length) continue;
		if (Mouse.within(this.x, this.y + i * 16, this.w - 16, 16)) {
			this.index = this.offset + i;
			if (Mouse.onDown(MOUSE_LEFT)) this.onClick.execute();
			if (Mouse.onDouble(MOUSE_LEFT)) this.onDoubleClick.execute();
		}
	}
	
	this.up = Mouse.within(this.right - 16, this.top, 16, 16);
	if (this.up && Mouse.onDown(MOUSE_LEFT)) this.increment();

	this.dn = Mouse.within(this.right - 16, this.bottom - 16, 16, 16);
	if (this.dn && Mouse.onDown(MOUSE_LEFT)) this.decrement();
}

ScrollList.prototype.draw = function() {
	var w = this.showBar ? this.w - 16 : this.w;
	Lib.windowstyle.drawWindow(this.x, this.y, this.w, this.h);
	
	SetClippingRectangle(this.x, this.y, w, this.h);	
	if (this.index >= 0)
		Rectangle(this.x, this.y + (this.index-this.offset) * 16, w, 16, this.hoverColor);
	
	var max = (this.shown < this.items.length) ? this.shown : this.items.length
	for (var i = 0; i < max; ++i) {
		var item = this.items[this.offset + i];
		if (!item) continue;
		
		var y = this.y + i * 16;
		
		if (item.image) {
			item.image.blitMask(this.x, y, item.color);
			Lib.drawText(this.x + item.image.width + 2, y, item.text, (i+this.offset == this.index) ? Colors.yellow : item.color);
		}
		else Lib.drawText(this.x + 2, y, item.text, item.color);
		
		Line(this.x, 16 + y, this.x + w, 16 + y, Colors.gray);
	}
	SetClippingRectangle(0, 0, Lib.SW, Lib.SH);
	if (this.showBar) this.drawBar();
}

ScrollList.prototype.drawBar = function() {
	Line(this.right - 17, this.top, this.right - 17, this.bottom, Colors.gray);
	
	Lib.upArrow.blitMask(this.right - 16, this.top, this.up ? Colors.yellow : Colors.white);
	Lib.downArrow.blitMask(this.right - 16, this.bottom - 16, this.dn ? Colors.yellow : Colors.white);
	
	Line(this.right-9, this.top+17, this.right-9, this.bottom-17, Colors.white);
	Line(this.right-8, this.top+17, this.right-8, this.bottom-17, Colors.gray);
	
	var maxoffset = this.items.length - this.shown + 1;
	Resources.images.slide.blit(this.right - 16, this.top + 16 + this.offset / maxoffset * (this.h - 48));
}