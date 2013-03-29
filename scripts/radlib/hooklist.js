/**
* Script: hooklist.js
* Written by: Radnen
* Updated: 3/29/2013
**/

/**
* HookList();
* - creates a list of functions, ordered by priority
*   and named so you can manage them however you want.
**/
function HookList() {
	this.hooks = [];
}

/**
* HookList.add(key : string, func : function [, priority : number]);
* - will add the funtcion 'func' named 'key' with
*   an optional priority.
**/
HookList.prototype.add = function(key, func, priority) {
	if (!Assert.checkArgs(arguments, "string", "function", "number")) return;
	
	if (priority === undefined) priority = 0;
	this.hooks.push({key: key, pr: priority, func: func, paused: false});
	this.sort();
}

HookList.prototype.sort = function() {
	this.hooks.sort(function (a, b) { return a.pr - b.pr; });
}

/**
* HookList.setPriority(key : string, priority : number]);
* - sets the priority of the function named by 'key'.
**/
HookList.prototype.setPriority = function(key, priority) {
	if (!Assert.checkArgs(arguments, "string", "number")) return;
	var hook = List.get(this.hooks, function(hook) { return hook.key == key; });
	hook.pr = priority;
	this.sort();
}

/**
* HookList.remove(key : string);
* - removes the function named by 'key'.
**/
HookList.prototype.remove = function(key) {
	if (!Assert.checkArgs(arguments, "string")) return;
	List.remove(this.hooks, function(hook) { return hook.key == key; });
}

/**
* HookList.update();
* - runs the functions.
* - put this in your main game loop.
**/
HookList.prototype.update = function() {
	List.foreach(this.hooks, function(hook) {
		if (!hook.paused) hook.func();
	});
}

/**
* HookList.pause(key : string);
* - pauses the function named by 'key'.
**/
HookList.prototype.pause = function(key) {
	if (!Assert.checkArgs(arguments, "string")) return;
	var hook = List.get(this.hooks, function(hook) { return hook.key == key; });
	hook.paused = true;
}

/**
* HookList.unpause(key : string);
* - unpauses the function named by 'key'.
**/
HookList.prototype.unpause = function(key) {
	if (!Assert.checkArgs(arguments, "string")) return;
	var hook = List.get(this.hooks, function(hook) { return hook.key == key; });
	hook.paused = false;
}