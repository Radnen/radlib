/**
* Script: stackstate.js
* Written by: Radnen
* Updated: 3/4/2013
**/

function StackState(data)
{
	this.w = Lib.SW/1.25;
	this.h = Lib.SH/2;
	this.x = Lib.SW/2-this.w/2;
	this.y = Lib.SH/2;
	State.call(this, "Stack");
	
	this.wind_h = new ValueLerper();
	this.alpha  = new ValueLerper();
	this.data = data.join("\n");
		
	this.bgColor = Colors.fromAlpha(0, Colors.black);

	var BG = CreateRectangle(Lib.SW, Lib.SH, Colors.white);
	this.preRender = function() {
		this.bgColor.alpha = this.alpha.value;
		BG.blitMask(0, 0, this.bgColor);
	}
	
	this.onEnter.add(function() {
		this.wind_h.lerp(0, this.h, 250);
		this.alpha.lerp(0, 150, 250);
	});

	this.update.add(function() {
		this.alpha.update();
		
		if (!this.wind_h.update() && this.closed) {
			this.hide();
		}
		
		okbutton.update();
		textbox.update();
	});
	
	var okbutton = new Button(this.x+this.w/2-8, this.y+this.h/2-21, "OK");
	okbutton.onClick.add(function(sender) { sender.close(); }, this);
	
	var label = new Label(this.x+6, this.y-this.h/2+6, "Call Stack:");
	
	// introduce textbox control
	var textbox = new TextBox(this.x+6, this.y-this.h/2+26, this.w-12, this.h-56, this.data);
	
	this.render.add(function() {
		Lib.windowstyle.drawWindow(this.x, this.y-this.wind_h.value/2, this.w, this.wind_h.value);		
		if (this.wind_h.isFinished()) {
			label.draw();
			textbox.draw();
			okbutton.draw();
		}
	});
}

StackState.prototype.close = function() {
	this.wind_h.lerp(this.h, 0, 250);
	this.alpha.lerp(150, 0, 250);
	this.closed = true;
}