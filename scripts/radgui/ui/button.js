/**
* Script: button.js
* Written by: Radnen
* Updated: 3/15/2013
**/

RequireScript("radgui/ui/control.js");

function Button (x, y, text, btn_up, btn_dn) {
	Control.call(this, x, y);
	this.w = Lib.font.getStringWidth(text)+4;
	this.h = Lib.font.getHeight();
	
	if (!text) Debug.log("Undefined name for button", LIB_WARN);
	this.text = text;
	
	this.btn_up = btn_up || Resources.windowstyles.buttonup;
	this.btn_dn = btn_dn || Resources.windowstyles.buttondn;
	
	this.hoverColor = CreateColor(50, 50, 250);
	this.inactiveColor = Colors.gray;
	
	this.onClick = new Event(this);
	
	this.state = 0; // 0 = idle, 1 = hover, 2 = pressed
}

Button.prototype = new Control();

Button.prototype.update = function() {
	this.state = this.mouseIn() ? (Mouse.onHold(MOUSE_LEFT) ? 2 : 1) : 0;
	if (this.state > 0 && this.enabled && Mouse.onUp(MOUSE_LEFT)) this.onClick.execute();
}
	
Button.prototype.draw = function() {
	var color = Colors.white;
	var wind = this.btn_up;
	
	if (this.state == 1) {
		color = this.enabled ? this.hoverColor : this.inactiveColor;
	}
	else if (this.state == 2) {
		color = this.enabled ? this.hoverColor : this.inactiveColor;
		wind = this.btn_dn;
	}
	
	wind.setColorMask(color);
	wind.drawWindow(this.x, this.y, this.w, this.h);
	Lib.drawText(this.x + 2, this.y + (this.state == 2 ? 1 : 0), this.text, this.state > 0 ? Colors.yellow : Colors.white);
}