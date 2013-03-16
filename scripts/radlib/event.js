/**
* Script: event.js
* Written by: Radnen
* Updated: 3/15/2013
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
	if (!Assert.is(parent, "object")) {
		Debug.log("An Event must reference a parent object.", LIB_ERROR);
		parent = null;
	}
	
	this.parent = parent;
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
	
	if (!Assert.is(func, "function")) {
		var str = FormatString("Event for {?} must be a function.", this.getParentName());
		Debug.log(str, LIB_ERROR);
		func = function() { };
	}
	
	if (!Assert.is(sender, "object")) {
		var str = FormatString("Sender of Event for {?} must be an object.", this.getParentName());
		Debug.log(str, LIB_ERROR);
		sender = null;
	}
	
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
	this.queue.unshift({func: func, sender: sender});
}

/**
* getParentName();
* - for debug purposes; gets the name of the
*   class of who owns this.
**/
Event.prototype.getParentName = function() {
	return this.parent.constructor.name;
}