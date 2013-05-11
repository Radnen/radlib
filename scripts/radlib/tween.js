/**
* Script: tween.js
* Written by: Radnen
* Updated: 5/8/2013
**/

/**
* Tweens;
*  - various interpolation functions that can be used
*    in the setup method of Tween, or standalone.
**/
var Tweens = {
	linear: function(a, b, t) {
		return a + b * t;
	},
	
	quad: function(a, b, t) {
		return a + b * t*t;
	},
	
	cubic: function(a, b, t) {
		return a + b * t*t*t;
	},
	
	sine: function(a, b, t) {
		return -b * Math.cos(t * (Math.PI/2)) + b + a;
	},
	
	exponential: function(a, b, t) {
		return b * Math.pow( 2, 10 * (t - 1) ) + a;
	},
	
	circular: function(a, b, t) {
		return -b * (Math.sqrt(1 - t*t) - 1) + a;
	},
}

/**
* Tween();
*  - creates a new instance of an interpolated unit.
**/
function Tween() {
    this.from  = 0;
	this.to    = 0;
	this.time  = 0;
	this.start = 0;
	this.func  = Tweens.linear;
	this.value = 0;
}

/**
* Tween.setup(from : number, to : number, duration : number [, func : function]);
*  - used to set the start and end points of the interpolation, 
*    it's duration in milliseconds, and the kind of interpolator.
**/
Tween.prototype.setup = function(from, to, duration, func) {
	if (func === undefined) func = Tweens.linear;
	this.from  = from;
	this.to    = to;
	this.time  = duration;
	this.start = GetTime();
	this.func  = func;
	this.value = from;
}

/**
* Tween.update();
*  - updates the value with respect to the interpolation function.
*  - returns false when it has finished.
**/
Tween.prototype.update = function() {
	if (this.time == -1) return false;
	if (this.start + this.time >= GetTime()) {
		this.value = this.func(this.from, this.to - this.from, (GetTime() - this.start) / this.time);
	}
	else {
		this.value = this.to;
		this.time = -1;
	}
	return true;
}

/**
* Tween.isFinished();
*  - returns true when it no longer updates values.
**/
Tween.prototype.isFinished = function() {
	return this.time == -1;
}