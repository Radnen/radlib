/**
* Script: menustate.js
* Written by: Radnen
* Updated: 3/6/2013
**/

function MenuState(name, x, y, centered)
{
	State.call(this, name);
	
	this.items = [];
	this.scale = new ValueLerper();
	this.alpha = new ValueLerper();
	this.bgColor = Colors.fromAlpha(0, Colors.black);
	this.current = 0;
	this.keyTime = 0;
	this.persitent = false;
	
	this.x = x;
	this.y = y;
	this.centered = centered;
	this.w = 0;
	this.closing = false;
	
	this.preRender = function() {
		Rectangle(0, 0, Lib.SW, Lib.SH, this.bgColor);
	}
	
	this.onEnter.add(function() {
		this.scale.lerp(0, 16, 250);
		this.alpha.lerp(0, 125, 250);
	});
	
	this.update.add(function() {
		this.alpha.update();
		this.bgColor.alpha = this.alpha.value;
		
		if (!this.scale.update() && this.closing) {
			this.callitem();
			this.closing = false;
		}
		
		if (Input.onKeyDown(Input.AKey) || Input.onButtonDown(Input.AButton)) this.close();
				
		if (this.keyTime + 180 < GetTime()) {
			if (Input.axisDown) this.increment();
			if (Input.axisUp) this.decrement();
			this.keyTime = GetTime();
		}

		var x = this.x - ((this.centered) ? this.w/2 : 0);
		var h = this.items.length*this.scale.value;
		var y = this.y - ((this.centered) ? h/2 : 0);
		if (Mouse.within(x, y + this.current * this.scale.value, this.w, 16)) {
			if (Mouse.onDown(MOUSE_LEFT)) this.close();
		}
	});
	
	this.render.add(function() {
		var x = this.x - ((this.centered) ? this.w/2 : 0);
		var h = this.items.length*this.scale.value;
		var y = this.y - ((this.centered) ? h/2 : 0);
		
		if (h == 0) return;
		Lib.windowstyle.drawWindow(x, y, this.w, h);
		if (h < 16) return;
		
		if (this.scale.update()) return;

		List.foreach(this.items, function(item, i) {
			var color = (i == this.current) ? Colors.yellow : Colors.white;
			
			Lib.drawText(x + 16, y + i * this.scale.value, item.name, color);
			
			if (Mouse.within(x, y + i * this.scale.value, this.w, 16)) {
				this.current = i;
			}
		}, this);
		
		Lib.arrow.blit(x, y+this.current*this.scale.value);
	});
	
	this.onInput = function(key) {
		switch (key) {
			case Input.upKey: this.decrement(); break;
			case Input.downKey: this.increment(); break;
		}
	}
}

MenuState.prototype.close = function() {
	this.closing = true;
  this.scale.lerp(16, 0, 250);
	this.alpha.lerp(125, 0, 250);
}

MenuState.prototype.callitem = function() {
	if (!this.persistent) StateManager.pop();
	this.items[this.current].call();
}

MenuState.prototype.increment = function() {
	if (this.current == this.items.length-1) return;
	this.current++;
}

MenuState.prototype.decrement = function() {
	if (this.current == 0) return;
	this.current--;
}

MenuState.prototype.addItem = function(name, callback) {
	if (!callback) callback = function() { };
	this.items.push({name: name, call: callback});
	this.w = Math.max(Lib.font.getStringWidth(name)+20, this.w);
}
