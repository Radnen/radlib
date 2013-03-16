/**
* Script: entity.js
* Written by: Andrew Helenius
* Updated: 12/27/2012
**/

/**
* Entity Package
* ============================================
* - Provides high level access to Sphere's
*   Entity objects.
*/
function Entity(name)
{
	this.name = name;
	this.dx = 0;
	this.dy = 0;
}

/**
* Entity Getters and Setters
* ============================================
* - Convenience members for easy access into
*   the properties held by Sphere Entities.
*/
Entity.prototype = {
	get angle() { return GetPersonAngle(this.name); },
	set angle(val) { SetPersonAngle(this.name, val); },
	get layer() { return GetPersonLayer(this.name); },
	set layer(val) { SetPersonLayer(this.name, val); },
	get x() { return GetPersonX(this.name); },
	set x(val) { SetPersonX(this.name, val); },
	get y() { return GetPersonY(this.name); },
	set y(val) { SetPersonY(this.name, val); },
	get speed() { return GetPersonSpeedX(this.name); },
	set speed(val) { SetPersonSpeed(this.name, val); },
	get direction() { return GetPersonDirection(this.name); },
	set direction(val) { 
		SetPersonDirection(this.name, val);
		this.dx = 0; this.dy = 0;
		switch (val) {
			case "north": this.dy = -1; break;
			case "south": this.dy = 1; break;
			case "west": this.dx = -1; break;
			case "east": this.dx = 1; break;
		}
	},
	get isQueueEmpty() { return IsCommandQueueEmpty(this.name); },
	get exists() { return DoesPersonExist(this.name); },
	get base() { return GetPersonBase(this.name); },
	get baseWidth() { return this.base.x2 - this.base.x1; },
	get baseHeight() { return this.base.y2 - this.base.y1; },
	get visible() { return IsPersonVisible(this.name); },
	set visible(val) { SetPersonVisible(this.name, val); },
	get spriteset() { return GetPersonSpriteset(this.name); },
	set spriteset(val) { SetPersonSpriteset(this.name, val); },
	get frame() { return GetPersonFrame(this.name); },
	set frame(val) { SetPersonFrame(this.name, val); },
	get offsetX() { return GetPersonOffsetX(this.name); },
	set offsetX(val) { SetPersonOffsetX(this.name, val); },
	get offsetY() { return GetPersonOffsetY(this.name); },
	set offsetY(val) { SetPersonOffsetY(this.name, val); },
	get ignoreOthers() { return IsIgnoringPersonObstructions(this.name); },
	set ignoreOthers(val) { IgnorePersonObstructions(this.name, val); },
	get ignoreTiles() { return IsIgnoringTileObstructions(this.name); },
	set ignoreTiles(val) { IgnoreTileObstructions(this.name, val); },
	get width() { return GetPersonValue(this.name, "width"); },
	get height() { return GetPersonValue(this.name, "height"); },
	get frameRevert() { return GetPersonFrameRevert(this.name); },
	set frameRevert(val) { SetPersonFrameRevert(this.name, val); },
	get mask() { return GetPersonMask(this.name); },
	set mask(val) { SetPersonMask(this.name, val); }
}

/**
* Entity.create();
* ============================================
* - Wrapper for Sphere's CreatePerson().
*/
Entity.prototype.create = function(spriteset, direction, x, y, layer) {
	if (!this.exists) CreatePerson(this.name, spriteset, true);
	if (layer != undefined) this.layer = layer;
	if (direction != undefined) this.direction = direction;
	if (x != undefined) this.x = x || 0;
	if (y != undefined) this.y = y || 0;
}

/**
* Entity.destroy();
* ============================================
* - Wrapper for Sphere's DestroyPerson().
* - Warning: this will invalidate this Entity
*   object for the named person.
*/
Entity.prototype.destroy = function() { DestroyPerson(this.name); }

/**
* Entity.clearQueue();
* ============================================
* - Wrapper for Sphere's ClearPersonCommands()
*/
Entity.prototype.clearQueue = function() { ClearPersonCommands(this.name); }

/**
* Entity.setXY(x, y);
* ============================================
* - Convenience method for setting an entities
*   pixel x/y position.
*/
Entity.prototype.setXY = function(x, y) {
	this.x = x;
	this.y = y;
}

/**
* Entity.setOffsetXY(x, y);
* ============================================
* - Convenience method for setting an entities
*   pixel x/y offsets.
*/
Entity.prototype.setOffsetXY = function(x, y) {
	this.offsetX = x;
	this.offsetY = y;
}

/**
* Entity.move(direction, tiles);
* ============================================
* - Convenience method for moving an entity in
*   a direction by so many tiles.
*/
Entity.prototype.move = function(direction, tiles) {
	tiles *= GetTileWidth();
	while (tiles--) { this.queueCommand(direction); }
}


/**
* Entity.isObstructedAt(x, y);
* ============================================
* - unlike the stock IsPersonObstructed(),
*   this method uses relative coordinates.
*/
Entity.prototype.isObstructedAt = function(x, y) {
	return IsPersonObstructed(this.name, this.x + x, this.y + y);
}

/**
* Entity.queueCommand(script, immediate);
* ============================================
* - Wrapper for Sphere's QueuePersonCommand().
*/
Entity.prototype.queueCommand = function(command, immediate) {
	if (immediate === undefined) immediate = false;
	QueuePersonCommand(this.name, command, immediate);
}

/**
* Entity.queueScript(script, immediate);
* ============================================
* - Wrapper for Sphere's QueuePersonScript(),
* - You can use '**' in the script to refer to
*   the current person without having to do
*   extra work to figure out who is running
*   this code.
**/
Entity.prototype.queueScript = function(script, immediate) {
	if (immediate === undefined) immediate = false;
	script = script.replace("**", "'" + this.name + "'");
	QueuePersonScript(this.name, script, immediate);
}