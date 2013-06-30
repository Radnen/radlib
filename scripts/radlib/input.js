/**
* Script: input.js
* Written by: Radnen
* Updated: 6/22/2013
**/

/**
 * InputGroup Package
 * - High level access to Sphere's input library.
 */
 
function InputGroup(num) {
	var i = 128;
	this.u_keys = new Array(i);
	this.d_keys = new Array(i);
	while(i--) {
		this.u_keys[i] = false;
		this.d_keys[i] = false;
	}
	
	if (!num) num = 0;
	this.num = num;
	
	var i = GetNumJoystickButtons(num);
	this.u_buttons = new Array(i);
	this.d_buttons = new Array(i);
	while (i--) {
		this.u_buttons[i] = false;
		this.d_buttons[i] = false;
	}
		
	this.AButton      = 0;
	this.BButton      = 1;
	this.XButton      = 2;
	this.YButton      = 3;
	this.LButton      = 4;
	this.RButton      = 5;
	this.selectButton = 6;
	this.startButton  = 7;
	
	this.upKey     = KEY_UP;
	this.downKey   = KEY_DOWN;
	this.leftKey   = KEY_LEFT;
	this.rightKey  = KEY_RIGHT;
	this.AKey      = KEY_CTRL;
	this.BKey      = KEY_SHIFT;
	this.XKey      = KEY_ALT;
	this.YKey      = KEY_SLASH;
	this.LKey      = KEY_COMMA;
	this.RKey      = KEY_PERIOD;
	this.startKey  = KEY_ENTER;
	this.selectKey = KEY_SPACE;
	
	this.cancelButton = this.BButton;
	this.cancelKey = this.BKey;
}

InputGroup.prototype = {
	get axisLeft () { return GetJoystickAxis(this.num, JOYSTICK_AXIS_X) < -0.5; },
	get axisRight() { return GetJoystickAxis(this.num, JOYSTICK_AXIS_X) >  0.5; },
	get axisUp   () { return GetJoystickAxis(this.num, JOYSTICK_AXIS_Y) < -0.5; },
	get axisDown () { return GetJoystickAxis(this.num, JOYSTICK_AXIS_Y) >  0.5; },
}

InputGroup.prototype.getKeys = function() {
	return {
		upKey: this.upKey,
		downKey: this.downKey,
		leftKey: this.leftKey,
		rightKey: this.rightKey,
		AKey: this.AKey,
		BKey: this.BKey,
		XKey: this.XKey,
		YKey: this.YKey,
		LKey: this.LKey,
		RKey: this.RKey,
		startKey: this.startKey,
		selectKey: this.selectKey
	};
}

InputGroup.prototype.getButtons = function() {
	return {
		AButton: this.AButton,
		BButton: this.BButton,
		XButton: this.XButton,
		YButton: this.YButton,
		LButton: this.LButton,
		RButton: this.RButton,
		selectButton: this.selectButton,
		startButton: this.startButton
	};
}

InputGroup.prototype.setInputs = function(inputs) {
	for (var i in inputs) this[i] = inputs[i];
}

InputGroup.prototype.save = function(file) {
	var ctrls = ShallowClone(this);
	delete ctrls.u_keys;
	delete ctrls.d_keys;
	delete ctrls.u_buttons;
	delete ctrls.d_buttons;
	file.store("keys", ctrls);
}

InputGroup.prototype.load = function(file) {
	Absorb(this, file.get("keys"));
}

InputGroup.prototype.onKeyUp = function(key) {
	var k = IsKeyPressed(key);
	var d = (this.u_keys[key] != k & !k);
	this.u_keys[key] = k;
	return d;
}

InputGroup.prototype.onKeyDown = function(key) {
	var k = IsKeyPressed(key);
	var d = (this.d_keys[key] != k & k);
	this.d_keys[key] = k;
	return d;
}

InputGroup.prototype.keyHeld = function(key) {
	return IsKeyPressed(key);
}

InputGroup.prototype.onButtonUp = function(button) {
	var b = IsJoystickButtonPressed(this.num, button)
	var d = (this.u_buttons[button] != b & !b);
	this.u_buttons[button] = b;
	return d;
}

InputGroup.prototype.onButtonDown = function(button) {
	var b = IsJoystickButtonPressed(this.num, button);
	var d = (this.d_buttons[button] != b & b);
	this.d_buttons[button] = b;
	return d;
}

InputGroup.prototype.buttonHeld = function(button) {
	return IsJoystickButtonPressed(this.num, button);
}

/* Used as a global input for player '0' */
var Input = new InputGroup(0);