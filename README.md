RadLib
======

Sphere RPG Engine Game Library

Usage
=====

Drop it into your Sphere game project and then call:

```javascript
RequireScript('RadLib.js');
```

Demo
====

Get your game up and running in seconds with the resource and state managers!

```javascript
// the only major file to include, it will automtaically
// include all other core radlib files.
RequireScript("radlib/radlib.js");

// the content pipeline loads all of your games resources
// into this object (such as Resources.images, etc.)
Resources.loadAll();

function game() {
    // this sets up some hooklists for
    // SetUpdateScript and SetRenderScript
    Game.setup();
							   
    // this allows the state manager
    // to run on top of the map engine.
    // only do this if you use the map
    // engine.
    Game.attachStateManager();
	
	// then run the game engine like normal
	MapEngine("a_map_here.rmp", 60);
	
	// or: StateManager.execute(); if you only use states in your game
	// or a mixture of states and the default map engine.
}
```

Tip:
Press Tab to view a JS console window, and type into it 'log'
to view a log list of errors and warnings in your active code.

Finished Libraries
==================

- [ ] core radlib library
- [ ] radgui
- [ ] radact

Credits
=======

 - Andrew "Radnen" Helenius
