/**
* Script: statemanager.js
* Written by: Radnen
* Updated: 3/13/2013
**/

RequireScript("radlib/valuelerper.js");

/**
 * StateManager Package
 * - Handles game state, update and render logic.
 */

var StateManager = (function(){
	var states = [];
	
	var step = 1000/60;
	var isFixed = false;
	var screens = 0;
	var request_s = false;
	
	var color = Colors.fromAlpha(0, Colors.white);
	var screenshot = "";
	var alpha = new ValueLerper();
	
	function SaveScreen() {
		CreateDirectory("~/images/screenshots");
		
		var file = null, sh;
		var s = GrabSurface(0, 0, Lib.SW, Lib.SH);

		do {
			file = FormatString("screenshots/screenshot{?}.png", screens++);
			sh = Path.getFileName(file);
		}
		while (Assert.fileExists("~/images/screenshots/", sh));
		
		if (file) {
			screenshot = sh;
			s.save(file);
			alpha.lerp(0, 1, 500);
		}
	}
	
	/* Wrapper for FlipScreen so that we can make screenshots. */
	var FS = FlipScreen;
	FlipScreen = function() {
		if (request_s) {
			SaveScreen();
			request_s = false;
		}
		FS();
	}
	
	/**
	* push();
	*  - Array wrapper for state stack, adds a state object.
	*  - state: the state object to add onto the state-stack.
	**/
	function Push(state) {
		if (states.length > 0) {
			states[states.length-1].active = false;
			states[states.length-1].onLeave.execute();
		}
		states.push(state);
		state.onEnter.execute();
	}
	
	/**
	* setFixedTimestep(value);
	* - if true; fixes the timestep to exactly 60 fps.
	*/
	function SetFixed(value) {
		isFixed = value;
	}
	
	/**
	* pop();
	*  - Array wrapper for state stack, removes and returns a state object.
	**/
	function Pop() {
		var state = states.pop();
		state.onLeave.execute();
		if (states.length > 0) {
			states[states.length-1].active = true;
			states[states.length-1].onEnter.execute();
		}
		return state;
	}
	
	/**
	* update();
	*  - Updates only the current top-most state.
	**/
	function Update() {
		if (states.length == 0) return;
		alpha.update();
		
		var state = states[states.length - 1];
		state.update.execute();
		
		while (AreKeysLeft()) {
			var key = GetKey();
			
			if (key == KEY_INSERT) {
				request_s = true;
			}
			
			// Give priority to debug console, if available.
			Debug.updateConsole(key);
			if (!Debug.open) state.onInput(key);
		}
		
		Mouse.update();
	}
	
	/**
	* render();
	*  - Renders all states, bottom to top. Top state will always be drawn physically on top.
	**/
	function Render() {
		List.foreach(states, function(state) { state.render.execute(); });
		StateManager.postRender();
		Debug.renderConsole();
		
		if (Debug.open) Debug.track("States: " + states.length);
				
		if (alpha.value > 0) {
			if (alpha.value == 1) alpha.lerp(1, 0, 500);
			color.alpha = alpha.value * 255;
			Lib.font.drawText(0, 0, screenshot, color);
		}
		
		if (IsMapEngineRunning() && request_s) {
			SaveScreen();
			request_s = false;
		}
	}
	
	/**
	* execute();
	*  - updates and renders the states.
	**/
	function Execute(fps) {
		if (fps) { SetFrameRate(fps); Debug.log(FormatString("State Manager Executed at {?} FPS", fps)); }
		else Debug.log(FormatString("State Manager Executed", fps));
		
		while (states.length) {
			Update();
			Render();
			Lib.drawCursor();
			FlipScreen();
		}
	}
	
	/**
	* purgeStates();
	*  - Clears all of the states; like quitting the game.
	**/
	function PurgeStates() {
		states = [];
	}
	
	/**
	* findState(text);
	*  - Finds and returns a state by name
	*  - name: the name of the state to find and return.
	**/
	function FindState(name) {
		var found = List.iterate(states, function (state) {
			if (state.name == name) return state.name;
		});
		if (!found) return null;
		else return found;
	}
	
	/**
	* getStateList();
	*  - returns a list of state name strings, not a list of the states.
	*    this is useful for debug purposes.
	**/
	function GetStateList() {
		var arr = [];
		List.foreach(states, function(state) { arr.push(state.name); });
		return arr;
	}
	
	/**
	* removeState(state);
	*  - Removes the state from the state stack.
	*  - state: the state object to remove or, the name of state
	*           object to find and remove.
	**/
	function RemoveState(state) {
		if (!Assert.is(state, "string") && !Assert.is(state, "object")) {
			Debug.log(FormatString("Wrong type for state removal: {?}", state), LIB_ERROR);
			return;
		}
		
		if (states.length == 1) { states = []; return; }
		
		if (!Assert.is(state, "string")) { state = state.name; }
		
		if (states[states.length-1].name == state) {
			var state = states.pop();
			state.onLeave.execute();
			states[states.length-1].active = true;
			states[states.length-1].onEnter.execute();
		}
		else {
			List.remove(states, state, "name");
		}
	}
	
	function IsRunning() {
		return states.length > 0;
	}
	
	return {
		push: Push,
		pop: Pop,
		update: Update,
		render: Render,
		execute: Execute,
		isRunning: IsRunning,
		postRender: function() { },
		purge: PurgeStates,
		findState: FindState,
		getStateList: GetStateList,
		removeState: RemoveState,
		setFixedTimestep: SetFixed,
	};
})();
