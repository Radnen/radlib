/**
* Script: dropdown.js
* Written by: Radnen
* Updated: 3/6/2013
**/

function DropDown()
{
	Control.call(this);
	this.items = [];
	
	this.opened = false;
	this.closing = false;
	
	this.onDrop = function() { };
	this.onUpdate = function() { };
	
	this.hv = new ValueLerper(0);
}

DropDown.prototype = new Control();

DropDown.prototype.addItem = function(name, call, owner) {
	this.items.push({name: name, call: call, lock: false, owner: owner});
	this.w = Math.max(this.w, Lib.font.getStringWidth(name) + 10);
	this.h += 16;
}

DropDown.prototype.show = function(x, y) {
	this.hv.lerp(0, 1, 100);
	this.x = x;
	this.y = y;
	this.opened = true;
	this.closing = false;
	this.onDrop();
}

DropDown.prototype.isOpen = function() {
	return this.opened;
}

DropDown.prototype.lock = function(num, predicate) {
	this.items[num].lock = predicate;
}

DropDown.prototype.changeName = function(num, name) {
	this.items[num].name = name;
	this.w = Math.max(this.w, Lib.font.getStringWidth(name) + 10);
}

DropDown.prototype.hide = function() {
	this.hv.lerp(1, 0, 100);
	this.closing = true;
}

DropDown.prototype.update = function() {
	if (!this.opened) return;
	if (!this.hv.update() && this.closing) {
		this.opened = false;
	}
	this.onUpdate();
}

DropDown.prototype.draw = function() {
	if (!this.opened) return;
	Lib.windowstyle.drawWindow(this.x, this.y, this.w, this.h*this.hv.value);
	SetClippingRectangle(this.x, this.y, this.w, this.h*this.hv.value);
	
	List.foreach(this.items, function(item, i) {
		var color = Colors.white;
		if (Mouse.within(this.x, this.y+i*16, this.w, 16)) {
			Rectangle(this.x, this.y+i*16, this.w, 16, Colors.transBlack);
			color = Colors.yellow;
			
			if (!item.lock && Mouse.onDown(MOUSE_LEFT)) { this.hide(); item.call.call(item.owner); }
		}
		if (item.lock) color = Colors.gray;
		Lib.drawText(this.x, this.y+i*16, item.name, color);
	}, this);
	
	if (!this.mouseIn() && Mouse.onDown(MOUSE_LEFT)) {
		this.hide();
	}

	SetClippingRectangle(0, 0, Lib.SW, Lib.SH);
}