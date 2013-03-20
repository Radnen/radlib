/**
* Script: behaviors.js
* Written by: Unknown
* Updated: 3/8/2013
**/

/*********************************************
	Stock Behaviors Supplied by RadLib Library.
**********************************************/

RequireScript("radlib/image.js");

function Behavior(parent) {
	this.parent = parent;
}

Behavior.prototype.update = function() { }
Behavior.prototype.render = function() { }

function TransformBehavior(parent, x, y, r) {
	Behavior.call(this, parent);
	this.x = x || 0;
	this.y = y || 0;
	this.r = r || 0;
}

TransformBehavior.prototype = new Behavior();

function DrawBehavior(parent, image) {
	Behavior.call(this, parent);
	
	if (image) this.image = new RadImage(image);
	this.width = (image) ? image.width : 0;
	this.height = (image) ? image.height : 0;
	this.color = CreateColor(255, 255, 255);
	
	this.trans = this.parent.getBehavior("TransformBehavior");
	
	if (this.parent.hasBehavior("CameraEffect"))
		this.camera = this.parent.getBehavior("CameraEffect").camera;
	else
		this.camera = { x: 0, y: 0, z: 1 };
}

DrawBehavior.prototype = new Behavior();

DrawBehavior.prototype.render = function() {
	if (this.image) {
		this.image.zoom(this.camera.z);
		this.image.rotateBlit(this.getX(), this.getY(), this.trans.r, this.color);
	}
}

DrawBehavior.prototype.setImage = function(image) {
	this.image = new RadImage(image);
	this.width = (image) ? image.width : 0;
	this.height = (image) ? image.height : 0;
}

DrawBehavior.prototype.getX = function() {
	return (this.trans.x - (this.width >> 1) - this.camera.x) * this.camera.z;
}

DrawBehavior.prototype.getWidth = function() {
	return this.image.width;
}

DrawBehavior.prototype.getHeight = function() {
	return this.image.height;
}

DrawBehavior.prototype.getY = function() {
	return (this.trans.y - (this.height >> 1) - this.camera.y) * this.camera.z;
}

function CameraEffect(parent, camera) {
	Behavior.call(this, parent);
	
	this.trans = parent.getBehavior("TransformBehavior");
	this.camera = camera;
}

CameraEffect.prototype = new Behavior();

function Hoverable(parent, props) {
	Behavior.call(this, parent);
	
	this.onUpdate = function() { };
	this.onRender = function() { };
	this.onEnter = function() { };
	this.onLeave = function() { };
	this.onClick = function() { };
	
	for (var i in props) this[i] = props[i];
	
	this.inside = false;
	
	this.draw = parent.getBehavior("DrawBehavior");
	this.trans = parent.getBehavior("TransformBehavior");
	this.entered = false;
}

Hoverable.prototype = new Behavior();

Hoverable.prototype.update = function() {
	var mx = GetMouseX();
	var my = GetMouseY();
	var x = this.draw.getX();
	var y = this.draw.getY();
	var w = x + this.draw.getWidth();
	var h = y + this.draw.getHeight();
		
	this.inside = mx > x && my > y && mx < w && my < h;
	
	if (!this.entered && this.inside) { this.onEnter(); this.entered = true; }
	if (this.entered && !this.inside) { this.onLeave(); this.entered = false; }
	
	if (this.inside) this.onUpdate.call(this);
}

Hoverable.prototype.render = function() {
	if (this.inside) this.onRender.call(this);
}

function BoundingBox(parent) {
	Behavior.call(this, parent);
	
	this.draw = parent.getBehavior("DrawBehavior");
}

BoundingBox.prototype = new Behavior();

BoundingBox.prototype.render = function() {
	if (Debug.extra)
		OutlinedRectangle(this.draw.getX(), this.draw.getY(), this.draw.getWidth(), this.draw.getHeight(), Colors.red, 1);
}

BoundingBox.prototype.getBox = function() {
	var t = this.draw.getY();
	var l = this.draw.getX();
	
	return {
		top: t,
		left: l,
		right: l + this.draw.getWidth(),
		bottom: t + this.draw.getHeight()
	}
}

BoundingBox.prototype.intersects = function(other) {
	var bb1 = this.getBox(), bb2;
	
	if (other instanceof BoundingBox)
		bb2 = other.getBox();
	else if (other instanceof BehaviorContainer)
		bb2 = other.getBehavior("BoundingBox").getBox();
	else
		Debug.abort("Can't find a bounding box in: " + other);
	
	return !(bb1.right < bb2.left ||
					bb1.left > bb2.right ||
					bb1.top > bb2.bottom ||
					bb1.bottom < bb2.top);
}

BoundingBox.prototype.pixelIntersects = function(other) {
	if (this.intersects(other)) {
		var bbox;
		
		if (other instanceof BoundingBox) bbox = other;
		else bbox = other.getBehavior("BoundingBox");
		
		var x = this.draw.getX();
		var y = this.draw.getY();
		
		return this.draw.image.collidesWith(x, y, bbox.draw.image, bbox.draw.getX(), bbox.draw.getY());
	}
}

function MouseLook(parent) {
	Behavior.call(this, parent);

	this.trans = parent.getBehavior("TransformBehavior");
	this.draw = parent.getBehavior("DrawBehavior");
}

MouseLook.prototype = new Behavior();

MouseLook.prototype.update = function() {
	var y = GetMouseY() - (this.draw.getY() + (this.draw.getHeight() >> 1));
	var x = GetMouseX() - (this.draw.getX() + (this.draw.getWidth()  >> 1));
	this.trans.r = Math.atan2(y, x);
}
