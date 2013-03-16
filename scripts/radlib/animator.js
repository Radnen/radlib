/**
* Script: animator.js
* Written by: Andrew Helenius
* Updated: 12/17/2012
**/

function Animator(person) {
	this.anims = {};
	this.last = -1;
	if (person instanceof Entity) this.entity = person;
	else if (typeof person == "string") this.entity = new Entity(person);
}

Animator.prototype.registerAction = function(direction, frame, func) {
	this.anims[direction+frame] = func;
}

Animator.prototype.unregisterAction = function(direction, frame) {
	delete this.anims[direction+frame];
}

Animator.prototype.update = function() {
	var frame = this.entity.frame;
	
	if (frame != this.last) {
		var func = this.anims[this.entity.direction+frame];
		if (func) func();
		this.last = frame;
	}
}

Animator.prototype.getDirection = function(direction) {
	var SS = this.entity.spriteset;
	
	for (var i = 0; i < SS.directions.length; ++i) {
		if (SS.directions[i].name == direction) return SS.directions[i];
	}
	
	Debug.abort("Direction, " + direction + ", not present in the sprite named " + this.entity.name + ".");
}

Animator.prototype.animate = function(direction) {
	this.entity.queueScript("SetPersonDirection(**,'" + direction + "');", true);
	this.entity.queueScript("SetPersonFrame(**, 0);", true);
	var dir = this.getDirection(direction);
	var delay = 0, frames = dir.frames.length-1;
	do { delay += dir.frames[frames].delay; } while(frames--);

	--delay;
	do {
		this.entity.queueCommand(COMMAND_ANIMATE, false);
	} while(--delay);
}