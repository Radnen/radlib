/**
* Script: state.js
* Written by: Radnen
* Updated: 3/29/2013
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
	
	/* Triggered Events: */
	this.onInput   = function(key){}; // remember to add a key argument when overloading.
	this.preRender = function(){};
	
	/* Internal State Variables */
	this.active = true;
	this.name   = name;

	/* Graphical Built-in Fading option */
	this.color  = Colors.fromAlpha(0, Colors.black);
	this.fade   = false;
	this.alpha  = new ValueLerper();
	
	this.render.add(function() { this.preRender(); });
	this.render.add(function() {
		if (this.fade) STATE_BG.blitMask(0, 0, this.color);
	});
	
	this.update.add(function() {
		if (this.fade) {
			this.alpha.update()
			this.color.alpha = this.alpha.value;
			if (this.alpha.isFinished() && this.alpha.to == 0) {
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
	}
	
	/**
	* hide();
	*  - Use this to hide the state.
	**/
	this.hide = function() {
		StateManager.removeState(this);
	}
	
	this.fadeIn = function(time, alpha) {
		if (!time) time = 250;
		if (!alpha) alpha = 150;
		if (!Assert.checkArgs(arguments, "number", "number")) return;
		
		this.fade = true;
		this.alpha.lerp(0, alpha, time);
	}
	
	this.fadeOut = function(time, alpha) {
		if (!time) time = 250;
		if (!alpha) alpha = 150;
		if (!Assert.checkArgs(arguments, "number", "number")) return;
		
		this.fade = true;
		this.alpha.lerp(alpha, 0, time);
	}
}