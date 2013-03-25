/**
* Script: hooklist.js
* Written by: Radnen
* Updated: 3/25/2013
**/

function HookList() {
	this.hooks = [];
}

HookList.prototype.add = function(key, func, priority) {
	if (priority === undefined) priority = 0;
	this.hooks.push({key: key, pr: priority, func: func, paused: false});
	this.sort();
}

HookList.prototype.sort = function() {
	this.hooks.sort(function (a, b) { return a.pr - b.pr; });
}

HookList.prototype.setPriority = function(key, priority) {
	var hook = List.get(this.hooks, function(hook) { return hook.key == key; });
	hook.pr = priority;
	this.sort();
}

HookList.prototype.remove = function(key) {
	List.remove(this.hooks, function(hook) { return hook.key == key; });
}

HookList.prototype.update = function() {
	List.foreach(this.hooks, function(hook) {
		if (!hook.paused) hook.func();
	});
}

HookList.prototype.pause = function(key) {
	var hook = List.get(this.hooks, function(hook) { return hook.key == key; });
	hook.paused = true;
}

HookList.prototype.unpause = function(key) {
	var hook = List.get(this.hooks, function(hook) { return hook.key == key; });
	hook.paused = false;
}