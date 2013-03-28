/**
* Script: game.js
* Written by: Andrew Helenius
* Updated: 3/27/2013
**/

RequireScript("radlib/hooklist.js");

/**
* Game Package
* ============================================
* - A class that manages the update and render
*   scripts for the defaukt map engine. Also,
*   feel free to add fields and functions to
*   this whenever you feel you need them.
*/

var Game = (function() {
	var update_hooks = new HookList();
	var render_hooks = new HookList();
		
	/**
	* Init();
	*  - Call this before the map engine call. 
	**/
	function Init() {
		Debug.log("Setting Update and Render Scripts", "");
		SetUpdateScript("Game.updates.update();");
		SetRenderScript("Game.renders.update();");
	}
	
	/**
	* CreatePlayer(name : string, spriteset : string);
	*  - Use this to quickly instantiate the player
	*    character, giving him a camera and input.
	**/
	function CreatePlayer(name, spriteset) {
		if (!name || !Assert.is(name, "string")) {
			Debug.log("Can't create player: invalid name.", LIB_ERROR);
			return;
		}
					
		if (!spriteset || !Assert.is(spriteset, "string")) {
			Debug.log("Can't create player: invalid spriteset.", LIB_ERROR);
			return;
		}

		if (name == "")
			Debug.log("Empty name for player character.", LIB_WARN);
		
		if (global["Entity"]) Game.player = new Entity(name);
		CreatePerson(name, spriteset, false);
		AttachCamera(name);
		AttachInput(name);
		SetPersonFrameRevert(name, 8);
	}
	
	/**
	* AttachStateManager();
	*  - Use this to enjoy the state manager while the
	*    map engine is running. A must have for map engine
	*    games that require the use of the state manager.
	**/
	function AttachStateManager() {
		// these get a high priority:
		update_hooks.add("StateUpdate", function() { StateManager.update(); }, 5);
		render_hooks.add("StateRender", function() { StateManager.render(); }, 5);
	}
	
	return {
		attachStateManager: AttachStateManager,
		player: null,
		init: Init,
		createPlayer: CreatePlayer,
		updates: update_hooks,
		renders: render_hooks
	};
})();