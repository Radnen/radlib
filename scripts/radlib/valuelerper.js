/**
* Script: valuelerper.js
* Written by: Radnen
* Updated: 3/4/2013
**/

/**
* Value Lerping Package
* ============================================
* - A convenience class for handling linear
*   time-related events. Whether it be
*   changing alpha values or panning a camera. 
**/
function ValueLerper(initial) {
	this.time  = 0;
	this.msecs = 0;
	this.to    = initial || 0;
	this.from  = initial || 0;
	this.value = initial || 0;
}

/**
* ValueLerper.lerp();
* ============================================
* - Used to set the initial, ending, and
*   duration parameters for the lerp.
* - 'lerp' stands for 'linear interpolation'.
**/
ValueLerper.prototype.lerp = function(a, b, d) {
	if (!Assert.is(a, "number")) { Debug.alert("ValueLerper.lerp: Arg 0 not a number.", LIB_WARN); a = 0; }
	if (!Assert.is(b, "number")) { Debug.alert("ValueLerper.lerp: Arg 1 not a number.", LIB_WARN); b = 0; }
	if (!Assert.is(d, "number")) { Debug.alert("ValueLerper.lerp: Arg 2 not a number.", LIB_WARN); d = 0; }
	
	this.from  = this.value = a;
	this.time  = GetTime();
	this.msecs = d;
	this.to    = b;
}

/**
* ValueLerper.update();
* ============================================
* - updates the timer. Returns false when it
*   is no longer active; otherwise it's true.
**/
ValueLerper.prototype.update = function() {
	var d = Math.min(1, (GetTime() - this.time) / this.msecs);
	this.value = Lib.lerp(this.from, this.to, d);
	return (this.value != this.to);
}

/**
* ValueLerper.isFinished();
* ============================================
* - returns true if the lerp has finished.
**/
ValueLerper.prototype.isFinished = function() {
	return (this.value == this.to);
}