/**
* Script: state.js
* Written by: Radnen
* Updated: 6/22/2013
**/

/**
* State Package
* ============================================
* - A framework for creating game states,
*   to be handled by the internal state
*   manager. See: statemanager.js
*/

const STATE_BG = CreateRectangle(GetScreenWidth(), GetScreenHeight(), Colors.white);

function State(name) {
	/* Event Handlers: */
	this.update     = new Event(this);
	this.render     = new Event(this);
	this.onEnter    = new Event(this);
	this.onLeave    = new Event(this);
	this.onFadedOut = new Event(this);
	this.onEntered  = new Event(this);
	
	/* Triggered Events: */
	this.onInput   = function(key){}; // remember to add a key argument when overloading.
	this.preRender = function(){};
	
	/* Public variables: */
	this.shown  = false;
	this.active = true;
	this.name   = name;

	/* Graphical Built-in Fading option: */
	var _color  = Colors.fromAlpha(0, Colors.black);
	var _fade   = false;
	var _alpha  = new Tween();
	
	this.isFading = function() { return _fade; };
	
	this.render.add(function() {
		if (_fade) STATE_BG.blitMask(0, 0, _color);
		this.preRender();
	});
	
	this.update.add(function() {
		if (_fade) {
			_alpha.update();
			_color.alpha = _alpha.value;
			if (_alpha.isFinished() && _alpha.to == 0) {
				this.onFadedOut.execute();
			}
		}
	});
	
	/**
	* show();
	*  - Use this to alternatively display the state.
	**/
	this.show = function() {
		StateManager.push(this);
		if (!this.shown) { this.onEntered.execute(); this.shown = true; }
	}
	
	/**
	* hide();
	*  - Use this to hide the state.
	**/
	this.hide = function() {
		StateManager.removeState(this);
		this.shown = false;
	}
	
	this.fadeIn = function(time, alpha) {
		if (!time) time = 250;
		if (!alpha) alpha = 150;
		if (!Assert.checkArgs(arguments, "number", "number")) return;
		if (_alpha.value == alpha) return;
		
		_fade = true;
		_alpha.setup(0, alpha, time, Tweens.quad);
	}
	
	this.fadeOut = function(time, alpha) {
		if (!time) time = 250;
		if (!alpha) alpha = _alpha.value;
		if (!Assert.checkArgs(arguments, "number", "number")) return;
		if (_alpha.value == 0) return;
		
		_fade = true;
		_alpha.setup(alpha, 0, time, Tweens.quad);
	}
}