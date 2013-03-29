/**
* Script: event.js
* Written by: Radnen
* Updated: 3/29/2013
**/

/**
* Event Package
* ============================================
* - .NET like event delegation object. Attach
*   to it methods or functions that may
*   eventually be called by the containing
*   object.
*/

function Event(parent)
{
	this.parent = parent;
	if (!Assert.checkArgs(arguments, "object")) this.parent = null;
	this.queue = [];
}

/**
* execute();
* - executes all of the commands, with a
*   reference back to its parent.
**/
Event.prototype.execute = function() {
	List.foreach(this.queue, function(event) {
		event.func.call(this.parent, event.sender);
	}, this);
}

/**
* add(func : function [, sender : object]);
* - func: the function to be called.
* - sender: the object which contains the
*   function, optional if global or anonymous.
**/
Event.prototype.add = function(func, sender) {
	if (sender === undefined) sender = null;
	if (!Assert.checkArgs(arguments, "function", "object")) return;
	this.queue.push({func: func, sender: sender});
}

/**
* insert(func : function [, sender : object]);
* - inserts at the beginning of the queue.
* - func: function to be called.
* - sender: an object which contains the
*   function, optional if global or anonymous.
**/
Event.prototype.insert = function(func, sender) {
	if (!Assert.checkArgs(arguments, "function", "object")) return;
	this.queue.unshift({func: func, sender: sender});
}
