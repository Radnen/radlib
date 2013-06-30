/**
* Script: rpghandler.js
* Written by: Radnen
* Updated: 6/30/2013
**/

/**
* Global RPG Handler object.
*  - handles saving and loading of games.
*  - handles update and render scripts.
*  - handles map entry and leave scripts.
*  - handles global data.
**/
var RPGHandler = ({
	clock: new GameClock(), // the game clock
	onPurge: null,          // event for when the handler purges
	
	/**
	* addPortrait(name, image_ref);
	*  - adds a portrait to be used by the textbox object.
	*  - 'name' should correlate to the name you use as the textbox speaker.
	**/
	addPortrait: function(name, image_ref) {
		this.portraits[name] = image_ref;
	},
	
	/**
	* save(name);
	*  - saves the file to a particular name.
	**/
	save: function(name) {
		var savefile = new SaveFile();
		
		Game.player.save(savefile);		
		QuestSys.save(savefile);
		EventManager.save(savefile);
		
		savefile.store("x", GetPersonX(Game.player.name));
		savefile.store("y", GetPersonY(Game.player.name));
		savefile.store("map", GetCurrentMap());
		savefile.store("music", Audio.getMusicFilename());
		savefile.store("direction", GetPersonDirection(Game.player.name));
		
		savefile.store("world", JSON.stringify(analogue.world));
		
		var time = this.clock.getTime(true);
		time[0] = Number(time[0]);
		time[1] = Number(time[1]);
		time[2] = Number(time[2]);
		savefile.store("clock", JSON.stringify(time));

		this.saveExtra(savefile);
		savefile.save(name);
	},
	
	/**
	* load(name);
	*  - loads from file of particular name.
	*  - will also initialize a new game.
	**/
	load: function(name) {
		this.purge();
		
		var file = new SaveFile(name);
		
		var x = file.get("x");
		var y = file.get("y");
		var map = file.get("map");
		var music = file.get("music");
		var direction = file.get("direction");

		analogue.mergeWorld(JSON.parse(file.get("world")));
		
		Game.player.load(file);
		
		QuestSys.load(file);
		EventManager.load(file);        
		
		this.loadExtra(file);
		
		this.extraLoadSetup(file);
		this.init();

		// workaround so that the clock works:
		var clock = JSON.parse(file.get("clock"));
		clock[0] = Number(clock[0]);
		clock[1] = Number(clock[1]);
		clock[2] = Number(clock[2]);
		this.clock.setTime(clock);
		this.clock.start();
		
		Audio.play(music);
		Audio.fadeIn(1000);
		if (!IsMapEngineRunning()) {
			if (global.persist) QueuePersonScript(Game.player.name, "RPGHandler.onMapEnter();", true);
			QueuePersonScript(Game.player.name, 'SetPersonXYFloat("' + Game.player.name + '", ' + x + ', ' + y + ');', true);
			QueuePersonScript(Game.player.name, 'SetPersonDirection("' + Game.player.name + '", "' + direction + '");', true);
			MapEngine(map, 60);
		}
		else {
			if (global.persist) this.onMapEnter();
			ChangeMap(map);
			SetPersonXYFloat(Game.player.name, x, y);
			SetPersonDirection(Game.player.name, direction);
		}
	},
	
	/**
	* extraLoadSetup();
	*  - overload this for extra initialization to take place.
	**/
	extraLoadSetup: function(file) { },
	
	doesSaveExist: function(name) {
		var files = GetFileList();
		return List.contains(files, function(text) { return text == name; } );
	},
	
	/**
	* init();
	*  - used in game function prior to opening the map engine.
	**/
	init: function() {
		SetRenderScript("RPGHandler.render();");
		SetUpdateScript("RPGHandler.update();");
		if (!global.analogue) {
			SetDefaultMapScript(SCRIPT_ON_LEAVE_MAP, "RPGHandler.onMapLeave();");
			SetDefaultMapScript(SCRIPT_ON_ENTER_MAP, "RPGHandler.onMapEnter();");
		}
		Debug.log("RadRPG: RPGHandler initialized");
	},
	
	/**
	* purge();
	*  - used to clear game-related info for a new game.
	**/
	purge: function() {
		if (Game.player && DoesPersonExist(Game.player.name)) DestroyPerson(Game.player.name);
		if (this.onPurge) this.onPurge();
		Camera.release();
		PeopleEngine.purge();
		QuestSys.purge();
		EventManager.purge();
		Screen.purge();
		this.clock = new GameClock();
		Debug.log("RadRPG: Purged All");
	},
	
	/**
	* update();
	*  - updates any radlib objects; must go in UpdateScript();
	**/
	update: function() {
		Camera.update();
		PeopleEngine.updatePeople();
		Audio.update();
	},
	
	/**
	* render();
	*  - renders any radlib objects; must go in RenderScript();
	**/
	render: function() {
		Screen.update();
	},
	
	/**
	* onMapEnter();
	*  - initializes map entry stuff; must go in map entry script.
	**/
	onMapEnter: function() {
	},
	
	/**
	* onMapLeave();
	*  - deinitializes local map stuff; must go in map leave script.
	**/
	onMapLeave: function() {
		PeopleEngine.purge();
	},
	
	/**
	* saveExtra(file);
	*  - overload this to save custom stuff
	*  - use the file argument to write to.
	**/
	saveExtra: function(file) { },
	
	/**
	* loadExtra(file);
	*  - overload this to load custom stuff
	*  - use the file argument to read from.
	**/
	loadExtra: function(file) { },
});