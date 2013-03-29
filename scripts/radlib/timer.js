/**
* Script: timer.js
* Written by: Radnen
* Updated: 3/29/2013
**/

/* Game Time Package: */

GetTime = function() { return Date.now(); }

function Timer(interval)
{
	if (!Assert.checkArgs(arguments, "number")) return;

	this.time = 0;
	this.interval = interval || 1000;
	this.paused = false;
	this.pause_time = 0;
	this.pause_value = 0;
}

Timer.prototype.start = function(i) {
	if (!Assert.checkArgs(arguments, "number")) return;
	if (i != undefined) this.interval = i;
	this.time = GetTime() + this.interval;
}

Timer.prototype.pause = function() {
	if (this.paused) { Debug.log("Redundant Timer Pause.", LIB_WARN); return; }
	this.paused = true;
	this.pause_time = GetTime();
	this.pause_value = this.time;
}

Timer.prototype.resume = function() {
	if (!this.paused) { Debug.log("Redundant Timer Resume.", LIB_WARN); return; }
	this.paused = false;
	this.time += GetTime() - this.pause_time;
}

Timer.prototype.reset = function() {
	/* to be implemented */
}

Timer.prototype.timedOut = function() {
	if (this.paused)
		return false;
	else
		return this.time < GetTime();
}

Timer.prototype.toString = function() {
	if (this.paused) return ""+Math.floor((this.pause_value - this.pause_time) / 1000);
	return ""+Math.floor((this.time - GetTime()) / 1000);
}