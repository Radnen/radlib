/**
* Script: clock.js
* Written by: Radnen
* Updated: 6/30/2013
**/

function GameClock() {
  this.started = 0;
  this.seconds = 0;
  this.minutes = 0;
  this.hours = 0;
}

GameClock.prototype.start = function() {
  this.started = GetTime();
}

GameClock.prototype.reset = function() {
	this.started = this.seconds = this.hours = this.minutes = 0;
}

GameClock.prototype.setTime = function(a) {
	this.seconds = a[2];
	this.minutes = a[1];
	this.hours = a[0];
}

GameClock.prototype.getTime = function(a) {
  var cms = GetTime() - this.started;
  var secs, mins, hours;
  
  var cs = Math.floor(cms / 1000 + this.seconds), s = cs % 60;
  secs = (s < 10) ? "0" + s : s;
  
  var cm = Math.floor(cs / 60 + this.minutes), m = cm % 60;
  mins = (m < 10) ? "0" + m : m;
  
  var h = Math.floor(cm / 60 + this.hours) % 24;
  hours = (h < 10) ? "0" + h : h;
  
  if (a) return [hours, mins, secs];
  return hours + ":" + mins + ":" + secs;
}