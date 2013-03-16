/**
* Script: logstate.js
* Written by: Radnen
* Updated: 3/13/2013
**/

function LogState(log)
{
	UIState.call(this, "LibLogState", 2, 2, Lib.SW-4, Lib.SH-4);
	
	var label = new Label(this.x+4, this.y+4, "Log: " + new Date().toDateString());
	label.window = true;	
	this.controls.add(label);
	
	var scrollbox = new ScrollList(this.x+4, this.y+24, this.w-8, this.h-54);
	scrollbox.onDoubleClick.add(function() {
		var box = new StackState(log[this.index].stack);
		box.show();
	});
	this.controls.add(scrollbox);
	
	var helplabel = new Label(this.x + 4, this.y+this.h-20, "Double-Click to see the call stack.");
	this.controls.add(helplabel);
	
	var rect = CreateGradient(Lib.SW, Lib.SH, Lib.colors.debugBG1, Lib.colors.debugBG1, Lib.colors.debugBG2, Lib.colors.debugBG2);
	this.preRender = function() {
		rect.blit(0, 0);
	}
	
	for (var i = 0; i < log.length; ++i) {
		var text = log[i].msg;
		var	image = Resources.images.orb;
		var color = null;
		
		switch (log[i].state) {
			case LIB_NORM : color = Lib.colors.debugText; break;
			case LIB_ERROR: color = Lib.colors.error; break;
			case LIB_WARN : color = Lib.colors.warning; break;
			case LIB_GOOD : color = Lib.colors.good; break;
		}

		scrollbox.addItem(text, color, image);
	}
	
	var next = new Button(this.x+this.w-52, this.y + this.h - 21, "Next");
	next.onClick.add(function(sender) { sender.hide(); }, this);
	this.controls.add(next);
	
	this.onInput = function(key) {
		if (key == KEY_RIGHT) next.onClick.execute();
	}
}