/**
* Script: mouse.js
* Written by: Andrew Helenius
* Updated: 3/27/2013
**/

var Mouse = (function() {
	var up = [], m_up = [];
	var dn = [], m_dn = [];
	var delay = 0, db = 0, last = -1;
	var x = 0, y = 0, last_x, last_y;
	var idle_time = 0, i = 3;
	while (i--) dn[i] = up[i] = false;
	
	function Update() {
		var b, btn = 3;
		
		last_x = x; last_y = y;
		x = GetMouseX();
		y = GetMouseY();
		if (IsMoving()) idle_time = GetTime() + 1000;
		
		while (btn--) {
			b = IsMouseButtonPressed(btn);
			
			m_dn[btn] = dn[btn] != b &  b;
			m_up[btn] = up[btn] != b & !b;

			dn[btn] = up[btn] = b;
			
			if (db > 1) db = 0;
			if (m_dn[btn]) {
				delay = GetTime() + 350;
				if (last == btn) db++;
				else { last = btn; db = 1; }
			}

			if (delay < GetTime()) db = 0;
		}
	}
	
	function OnDown(b) { return m_dn[b]; }
	function OnUp(b) { return m_up[b]; }
	function OnDouble(b) { return m_dn[b] & db > 1; }
	function OnHold(b) { return IsMouseButtonPressed(b); }
	function IsMoving() { return last_x != x || last_y != y; }
	function IsIdle() { return stay_timer < GetTime(); }
	
	function Within(xx, yy, w, h) {
		return x > xx && y > yy && x <= xx + w && y <= yy + h;
	}
	
	function Draw(image, fade) {
		image.blit(x, y);
		if (fade) image.blit(last_x, last_y);
	}
	
	return {
		draw: Draw,
		isIdle: IsIdle,
		isMoving: IsMoving,
		onDouble: OnDouble,
		onDown: OnDown,
		onHold: OnHold,
		onUp: OnUp,
		setXY: SetMousePosition,
		update: Update,
		within: Within,
		get x() { return x; },
		set x(v) { SetMousePosition(v, y); },
		get y() { return y; },
		set y(v) { SetMousePosition(x, v); },
	}
})(); // Aww yis!
