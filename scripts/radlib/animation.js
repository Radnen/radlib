/**
* Script: animation.js
* Written by: Radnen
* Updated: 3/7/2013
**/

const ANIM_BY_FRAME = 0;
const ANIM_BY_TIME = 1;

function Animation() {
	this.frames = [];

	this.mode = ANIM_BY_FRAME;
	this.loop = false;
	
	this.delay = 0;
	this.frame = 0;
	this.time = 0;
	
	this.color = Colors.white;
}

Animation.prototype.addFrame = function(delay, image) {
	this.frames.push({d: delay, i: image});
}

Animation.prototype.play = function(loop) {
	this.loop = loop;
	this.frame = 0;
	this.delay = this.frames[this.frame].d;
	this.time = GetTime() + this.delay * 10;
}

Animation.prototype.step = function() {
	if (this.frame == this.frames.length - 1) {
		if (this.loop) this.play(this.loop);
	}
	else {
		this.frame++;
		this.delay = this.frames[this.frame].d;
		this.time = GetTime() + this.delay * 10;
	}
}

Animation.prototype.update = function() {
	if (this.mode == ANIM_BY_FRAME) {
		if (this.delay == 0) this.step();
		this.delay--
	}
	else if (this.time < GetTime()) this.step();
}

Animation.prototype.draw = function(x, y) {
	this.frames[this.frame].i.blitMask(x, y, this.color);
}