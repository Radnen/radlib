/**
* Script: stat.js
* Written by: Radnen
* Updated: 7/17/2012
**/

/**
* Basic Stat Object:
*  - name: name of the stat.
*  - min: low value.
*  - max: high value.
**/
function Stat(min, max)
{
	if (!max) max = min;
	
	this.max = max;
	this.min = min;
}

Stat.prototype.add = function(stat) {
	this.max += stat.max;
	this.min += stat.min;
}

Stat.prototype.remove = function(stat) {
	this.max -= stat.max;
	this.min -= stat.min;
}

Stat.prototype.isFull = function() { return this.min == this.max; }

Stat.prototype.heal = function(amt) {
	this.min = Math.min(this.min+amt, this.max);
}

Stat.prototype.hurt = function(amt) {
	this.min = Math.max(this.min-amt, 0);
}

Stat.prototype.toString = function() {
	if (this.max == 0) return this.min;
	else return Math.floor(this.min) + "/" + this.max;
}