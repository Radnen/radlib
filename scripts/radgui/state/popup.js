/**
* Script: popup.js
* Written by: Radnen
* Updated: 3/12/2013
**/

const POPUP_YESNO = 1;
const POPUP_OK    = 2;

function PopupBox(name, text, options, w, h)
{
	var w = Lib.SW/2;
	var h = Lib.SH/3;
	UIState.call(this, name, Lib.SW/2-w/2, Lib.SH/2-h/2, w, h);
	
	this.text = text;
	this.options = options || POPUP_OK;
	this.toggle = true;
	this.keyTime = 0;
	this.window = true;
		
	this.onYes = new Event(this);
	this.onNo = new Event(this);
		
	var okButton = new Button(this.x+this.w/2-8, this.y+this.h-21, "OK");
	okButton.onClick.add(function(sender) { sender.close(); }, this);
	
	var yesButton = new Button(this.x+this.w-39, this.y+this.h-21, "YES");
	yesButton.onClick.add(function(sender) { sender.close(); }, this);
	
	var noButton = new Button(this.x+5, this.y+this.h-21, "NO");
	noButton.onClick.add(function(sender) { sender.close(); sender.toggle = false; }, this);
	
	this.onEnter.add(function() {
		this.growVert();
		this.growHoriz();
		this.fadeIn();
	});
	
	this.onFadedOut.add(function() {
		this.hide();
		if (this.toggle)
			this.onYes.execute();
		else
			this.onNo.execute();
	});
	
	this.update.add(function() {
		if (this.closed) return;
		
		if (Input.onKeyDown(Input.AKey) || Input.onButtonDown(Input.AButton)) {
			close(this);
		}
		
		if (this.options == POPUP_OK) okButton.update();
		
		if (this.options == POPUP_YESNO) {
			yesButton.update();
			noButton.update();
			if (this.keyTime < GetTime()) {
				if (Input.onKeyDown(Input.rightKey) || Input.axisRight) { this.toggle = false; }
				if (Input.onKeyDown(Input.leftKey) || Input.axisLeft) { this.toggle = true; }
				this.keyTime = GetTime() + 180;
			}
		}
	});
	
	this.render.add(function() {		
		if (!this.closed) {
			Lib.font.drawTextBox(this.x+2, this.y, this.w-4, this.wind_h.value, 0, this.text);
			switch (this.options) {
				case POPUP_OK: okButton.draw(); break;
				case POPUP_YESNO: yesButton.draw(); noButton.draw(); break;
			}
		}
	});
}

PopupBox.prototype.close = function() {
	this.shrinkVert();
	this.shrinkHoriz();
	this.fadeOut();
}