/**
* Script: behaviorcontainer.js
* Written by: Andrew Helenius
* Updated: 12/8/2012
**/

function BehaviorContainer(name) {
	this.name = name;
	this.b = {};
	this.b_list = [];
}

BehaviorContainer.prototype.update = function() {
	List.foreach(this.b_list, function(b) { b.update(); });
}

BehaviorContainer.prototype.render = function() {
	List.foreach(this.b_list, function(b) { b.render(); });
}

BehaviorContainer.prototype.getBehavior = function(name) {
	if (!this.hasBehavior(name))
		Debug.abort("A behavior depends on: " + name + "\nCheck behaviors in: " + this.name);
	else
		return this.b[name];
}

BehaviorContainer.prototype.hasBehavior = function(name) {
	return (name in this.b);
}

BehaviorContainer.prototype.addBehavior = function(b) {
	this.b[b.name] = new b(this, arguments[1], arguments[2], arguments[3], arguments[4]);
	this.b_list.push(this.b[b.name]);
}