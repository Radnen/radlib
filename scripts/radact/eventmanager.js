/**
* Script: eventmanager.js
* Written by: Andrew Helenius
* Updated: 3/20/2013
**/

var EventManager = {
	actors: {}, // convenience list of actors
	queue: [],  // where waiting threads go
	active: [], // where threads are running
	events: {}, // events as a JSON-able object
	eventHooks: {}, // actual functions of events
	skipAll: false,
	curThread: [],
	preEvent: null,
	postEvent: null,
	curId: "",
	
	addActor: function(name) {
		var actor = new Entity(name);
		this.actors[name] = actor;
		return actor;
	},
	
	removeActor: function(actor) {
		if (Camera.input == actor.name) Camera.input = null;
		delete this.actors[actor.name];
		actor.destroy();
	},
	
	addEvent: function(id, func) {
		var states = [];
		for (var i = 1; i < arguments.length; ++i) states.push(arguments[i]);
		this.eventHooks[id] = states;
		this.events[id] = false;
	},
	
	purge: function() {
		this.events = {};
		this.actors = {};
		this.queue = [];
		this.active = [];
		this.curThread = [];
		this.skipAll = false;
		this.curId = "";
	},
	
	save: function(contents) {
		contents["events"] = JSON.stringify(this.events);
	},
	
	load: function(contents) {
		this.events = JSON.parse(contents["events"]);
	},
	
	isComplete: function(id) {
		if (!(id in this.events)) throw "Event id: " + id + " does not exist.";
		return this.events[id];
	},
	
	// cretae an event with prehaps multiple sub-states:
	play: function(id, repeat) {
		if (!(id in this.events)) {
			Debug.log("Event Manager: Event " + id + " does not exist.", LIB_WARN);
			return;
		}

		if (!this.events[id] || repeat) {
			this.curId = id;
			this.queue[0] = [];
			this.curThread = this.queue[0];
			if (this.preEvent) this.execute(this.preEvent);
			this.eventHooks[id][0].call(this); this.idle(250);
			if (this.postEvent) this.execute(this.postEvent);
			this.events[id] = true;
			this.active.push(this.queue.shift());
		}
	},
	
	// jump to a substate of an event:
	jump: function(num) {
		this.queue.push(this.active[0]);
		if (this.preEvent) this.execute(this.preEvent);
		this.eventHooks[this.curId][num].call(this);
		if (this.postEvent) this.execute(this.postEvent);
		this.queue.shift();
	},
	
	fork: function() { // put from waiting onto active, setup for waiting
		this.execute(function() { EventManager.active.push(EventManager.queue.shift()); });
		this.curThread = [];
	},
	
	endf: function() {
		this.queue.push(this.curThread);
		this.curThread = this.queue[0];
	},
	
	synch: function(num) {
		var action = this.createThread(null, this.wait, null);
		action.arguments = [num];
		this.enqueue(action);
	},
	
	skip: function() { this.skipAll = true; },
	
	enqueue: function(action) {
		this.curThread.push(action);
	},
	
	update: function() {
		for (var i = 0; i < this.active.length; ++i) {
			this.processThread(this.active[i], i);
			if (this.active[i].length == 0) { this.active.splice(i, 1); i--; }
		}
	},
	
	processThread: function(thread, id) { // issues here
		if (!thread[0]) return;
		var event = thread[0];
		var args = [event.state].concat(event.arguments);

		if (!event.started) { if (event.start) { event.start.apply(event, args); } event.started = true; }
		
		var fin = (event.update && !this.skipAll) ? event.update.apply(event, args) : true;
		if (fin || this.skipAll) {
			if (!event.ended) { if (event.end) { event.end.apply(event, args); } event.ended = true; }
			thread.shift();
			if (this.allFinished()) this.skipAll = false;
		}
	},
	
	createThread: function(start, update, end) {
		return {
			state: {},
			arguments: [],
			start: start,
			update: update,
			end: end,
			started: false,
			ended: false
		};
	},
	
	addAction: function(name, action) { // utilizes an ACTOR!
		if (name in this) {
			Debug.log("Event Manager: Action " + name + " is already in use!", LIB_WARN);
			return;
		}
		
		this[name] = function() {
			var thread = this.createThread(action.start, action.update, action.end);
			if (arguments[0] in this.actors) thread.arguments[0] = this.actors[arguments[0]];
			else thread.arguments[0] = this.addActor(arguments[0]);
			for (var i = 1; i < arguments.length; ++i) thread.arguments[i] = arguments[i];
			this.enqueue(thread);
		}
	},

	addOperation: function(name, action) { // no ACTORS!
		if (name in this) {
			Debug.log("Event Manager: Action " + name + " is already in use!", LIB_WARN);
			return;
		}

		this[name] = function() {
			var thread = this.createThread(action.start, action.update, action.end);
			for (var i = 0; i < arguments.length; ++i) thread.arguments[i] = arguments[i];
			this.enqueue(thread);
		}
	},
	
	doesActorExist: function(name) {
		return (name in this.actors);
	},
	
	// internal use:
	wait: function(state, num) {
		if (num != undefined) return EventManager.threads[num].length == 0;
		return EventManager.active.length == 1;
	},
	
	allFinished: function() {
		for (var i = 0; i < this.active.length; ++i) {
			if (this.active[i].length != 0) return false;
		}
		return true;
	}
}

// built-ins:
EventManager.addAction("move", {
	start: function(state, actor, direction, tiles, face, speed) {
		if (speed === undefined) speed = 1;		
		if (!face) {
			if (direction == NORTH) face = "north";
			if (direction == SOUTH) face = "south";
			if (direction == EAST) face = "east";
			if (direction == WEST) face = "west";
		}

		actor.direction = face;
		
		// figure out location
		state.oldSpeed = actor.speed;
		state.x = actor.x+(tiles*speed*actor.dx*GetTileWidth());
		state.y = actor.y+(tiles*speed*actor.dy*GetTileHeight());
		state.endFace = face;
		
		// move the actor
		actor.speed = speed;
		actor.move(direction, tiles);
	},
	
	update: function(state, actor) {
		return actor.isQueueEmpty;
	},
	
	end: function(state, actor) {
		actor.clearQueue();
		actor.direction = state.endFace;
		actor.setXY(state.x, state.y);
		actor.speed = state.oldSpeed;
	},
});

EventManager.addAction("moveToLocation", {
	start: function(state, actor, x, y) {
		state.speed = actor.speed;
		state.x = x*GetTileWidth()+(actor.baseWidth>>1);
		state.y = y*GetTileHeight()+(actor.baseHeight>>1);
		actor.speed = 1;
		var path = GetPath(actor.name, -1, -1, 1, x, y);
		MovePath(actor.name, path);
		switch (path[path.length-2]) {
			case "E": state.face = "east"; break;
			case "W": state.face = "west"; break;
			case "N": state.face = "north"; break;
			case "S": state.face = "south"; break;
		}
	},
	
	update: function(state, actor) {
		return actor.isQueueEmpty;
	},
	
	end: function(state, actor) {
		actor.clearQueue();
		actor.speed = state.speed;
		actor.setXY(state.x, state.y);
		actor.direction = state.face;
	},
});

EventManager.addAction("moveOver", {
	start: function(state, actor, command, times) {
		var i = times;
		while(i--) actor.queueCommand(command, false);
		var xv = 0, yv = 0;
		switch (command) {
			case NORTH: yv = -1; break;
			case SOUTH: yv = 1; break;
			case WEST: xv = -1; break;
			case EAST: xv = 1; break;
		}
		state.x = actor.x+xv*times;
		state.y = actor.y+yv*times;
	},	
	update: function(state, actor) { return actor.isQueueEmpty; },
	end: function(state, actor) { actor.setXY(state.x, state.y); }
});

EventManager.addAction("animate", {
	start: function(state, actor, direction) { Animate(actor.name, direction); },
	update: function(state, actor) { return actor.isQueueEmpty; },
	end: function(state, actor) { actor.clearQueue(); }
});

EventManager.addAction("setVisible", {
	end: function(state, actor, value) { actor.visible = value; }
});

EventManager.addAction("setSpriteset", {
	end: function(state, actor, spriteset) { actor.spriteset = spriteset; }
});

EventManager.addAction("kill", {
	end: function(state, actor) { EventManager.removeActor(actor); }
});

EventManager.addAction("face", {
	end: function(state, actor, face) { actor.direction = face; }
});

EventManager.addAction("setXY", {
	end: function(state, actor, x, y) { actor.setXY(x, y); }
});

EventManager.addAction("setTileXY", {
	end: function(state, actor, x, y) {
		var tx = x * GetTileWidth() + (actor.baseWidth >> 1);
		var ty = y * GetTileHeight() + (actor.baseHeight >> 1);
		actor.setXY(tx, ty);
	}
});

EventManager.addOperation("idle", {
	start: function(state, msecs) { state.time = GetTime(); },
	update: function(state, msecs) { return state.time + msecs < GetTime(); }
});

EventManager.addOperation("execute", {
	end: function(state, func) { func(); }
});

if (this.Camera) {
	EventManager.addAction("panToPerson", {
		start: function(state, actor, time) {
			state.x = actor.x; state.y = actor.y;
			Camera.panToPerson(actor.name, time, false);
		},		
		update: function() { return Camera.done; },
		end: function(state, actor) {
			Camera.forceFinish();
			Camera.attach(actor.name);
		},
	});

	EventManager.addOperation("panToTile", {
		start: function(state, x, y, time) {
			state.x = x*GetTileWidth(); state.y = y*GetTileHeight();
			Camera.panToTile(x, y, time, false);
		},		
		update: function() { return Camera.done; },
		end: function(state) { Camera.forceFinish(); },
	});
}

if (this.Screen) {
	EventManager.addOperation("fadeIn", {
		start: function(state, msecs) { Screen.fadeIn(msecs); },
		update: function() { return Screen.done; },
		end: function() { Screen.forceFinish(); }
	});

	EventManager.addOperation("fadeOut", {
		start: function(state, msecs) { Screen.fadeOut(msecs); },
		update: function() { return Screen.done; },
		end: function() { Screen.forceFinish(true); }
	});
}

if (this.Audio) {
	EventManager.addOperation("playSound", {
		end: function(state, file) { Audio.playSound(file); }
	});
	
	EventManager.addOperation("playAudio", {
		end: function(state, music) { Audio.play(music); }
	});
	
	EventManager.addOperation("fadeInAudio", {
		start: function(state, msecs) { Audio.fadeIn(msecs); },
		update: function() { return Audio.done; },
		end: function() { Audio.forceFinish(); },
	});
	
	EventManager.addOperation("fadeOutAudio", {
		start: function(state, msecs) { Audio.fadeOut(msecs); },
		update: function() { return Audio.done; },
		end: function() { Audio.forceFinish(); },
	});	
}