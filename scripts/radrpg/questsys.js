/* Global Quest Object */

function Quest(name, text)
{
	this.name     = name;
	this.text     = text;
	this.state    = 0;
	this.finished = false;
}

function FetchQuest(name, text, amount)
{
	Quest.call(this, name, text);
	
	this.count = 0;
	this.amount = amount;
}

var QuestSys = ({
	quests: [], // use this to iterate through quests or access via index
	lookup: {}, // use this to access quests based on id
	
	/* start from square 1 */
	purge: function() {
		this.quests = [];
		this.lookup = {};
	},
	
	/* saves via JSON, into file. */
	save: function(savefile) {
		savefile.store("quests", JSON.stringify(this.lookup));
	},
	
	/* loads via JSON, from file. */
	load: function(savefile) {
		//this.quests = JSON.parse(content["quests"]);
		//List.foreach(this.quests, function(quest) { this.lookup[quest.id] = quest; }.bind(this));
		this.lookup = JSON.parse(savefile.get("quests"));
		for (var i in this.lookup) this.quests.push(this.lookup[i]);
	},
	
	/* add a quest to current story */
	addQuest: function(id, quest) {
		LocationBar.showArea("Quest: " + quest.name);
		this.quests.push(quest);
		this.lookup[id] = quest;
	},
	
	/* returns a quest object */
	getQuest: function(id) {
		if (id in this.lookup) return this.lookup[id];
		else {
			Debug.log("Quest {?} does not exist.", id, LIB_WARN);
			return null;
		}
	},
	
	/* Adds to an internal quest flag */
	setQuestStatus: function(id, num) {
		var q = this.getQuest(id);
		if (q)
			q.state = num;
		else
			Debug.log("Quest {?} does not exist.", id, LIB_WARN);
	},
	
	/* Returns the linear quest flag */
	getQuestStatus: function(id) {
		var q = this.getQuest(id);
		if (q) return q.state;
		else {
			Debug.log("Quest {?} does not exist.", id, LIB_WARN);
			return -1;
		}
	},
	
	/* Returns true if the quest exits */
	doesQuestExist: function(id) {
		return id in this.lookup;
	},
	
	/* Completes a quest, and optionally changes the text to some final message. */
	completeQuest: function(id, text) {
		var q = this.getQuest(id);
		if (!q) {
			Debug.log("Quest {?} does not exist.", id, LIB_WARN);
			return;
		}

		q.finished = true;
		if (text) q.text = text;
				
		LocationBar.showArea("Quest Completed!");
		return true;
	},
	
	/* Returns the completion status of a quest */
	isComplete: function(id) {
		var q = this.lookup[id];
		if (q) return q.finished;
		else {
			Debug.log("Quest {?} does not exist.", id, LIB_WARN);
			return false;
		}
	},
	
	/* Updates the properties of a quest. */
	addToQuest: function(id, text, state) {
		var q = this.lookup[id];
		if (q) {
			if (text !== undefined) q.text = text;
			if (state !== undefined) q.state = state;
			LocationBar.showArea("Updated: " + q.name);
		}
		else {
			Debug.log("Quest {?} does not exist.", id, LIB_WARN);
			return false;
		}
	},

	/* Updates the name of a quest. */
	changeQuestName: function(id, name) {
		var q = this.lookup[id];
		if (q) q.name = name;
		else {
			Debug.log("Quest {?} does not exist.", id, LIB_WARN);
			return false;
		}
	},
	
	/* Removes the quest from the list. */
	removeQuest: function(id) {
		if (id in this.lookup) {
			List.remove(this.quests, List.objEq(this.lookup[id]));
			delete this.lookup[id];
		}
		else Debug.log("Quest {?} does not exist.", id, LIB_WARN);
	}
});

var EventSys = ({
	events: {},
	funcBefore: function(){},
	funcAfter: function(){},
	
	/* Grabs an event by it's ID. If no event is found; return's null. */
	getEvent: function(id) {
		return this.events[id];
	},
	
	/* Play an event by it's id. This will flag it as 'on' and running. */
	play: function(id, looped) {
		Debug.alert("RadRPG: event not playing!?");
		if (!this.events[id].complete || looped) {
			this.funcBefore();
			this.events[id].activate(looped);
			this.funcAfter();
		}
		if (this.events[id].complete && !looped) Debug.log("RadRPG: Playing a completed event", LIB_WARN);
	},
	
	/* Returns the completion status of the event. */
	isComplete: function(id) {
		return this.events[id].complete;
	},
	
	/**
	* saveEventStatus(file);
	*  - saves events into specified file.
	**/
	saveEventStatus: function(file) {
		for (var i in this.events) {
			file.write("event-"+i, this.events[i].complete);
		}
	},
	
	/**
	* loadEventStatus(file);
	*  - loads all events from the specified file.
	**/
	loadEventStatus: function(file) {
		for (var i in this.events) {
			this.events[i].complete = file.read("event-"+i, false);
		}
	},
	
	/**
	* purge();
	*  - sets all events to incomplete.
	**/
	purge: function() {
		for (var i in this.events) {
			this.events[i].complete = false;
		}
	},
	
	/**
	* addEvent(id, action);
	*  - adds the event named 'id', and the callback action when played.
	**/
	addEvent: function(id, action) {
		this.events[id] = ({
			id: id,
			complete: false,
			action: action,
			activate: function(loopable) {
				var last = "";
				if (IsInputAttached()) {
					last = GetInputPerson();
					DetachInput();
				}
				this.action();
				if (last != "") AttachInput(last);
				if (!loopable) this.complete = true;
			}
		});
	}
});