RadLib
======

Sphere RPG Engine Game Library

Official Website: http://radnen.tengudev.com/radlib.html

Usage
=====

Drop it into your Sphere game project and then call:

```javascript
RequireScript('radlib/radlib.js');
```

Demo
====

Get your game up and running in seconds with the resource and state managers!

```javascript
// The only major file to include, it will automtaically
// include all other core radlib files.
RequireScript("radlib/radlib.js");

// The content pipeline loads all of your games resources
// into this object (images can be accessed from Resources.images, etc.)
Resources.loadAll();

// Optionally, you may want to add packages such as the
// radgui library so that you can add intersting menus
// to the game via the state manager.
// These have to be done after resources are loaded
// so that they can use the content pipeline.
RequireScript("radgui/radgui.js");

function game() {
    // This sets up some hooklists for
    // SetUpdateScript and SetRenderScript
    Game.init();
    
    // This allows the state manager
    // to run on top of the map engine.
    // only do this if you use the map
    // engine.
    Game.attachStateManager();
    
    // This is will quickly create a player character,
    // attaching the camera, input, and setting their
    // frame revert all at once.
    Game.createPlayer("name_here", "some_spriteset.rss");
    
    // Then run the game engine like normal
    MapEngine("a_map_here.rmp", 60);
    
    // OR: StateManager.execute(); if you only use states in your game
    // OR: A mixture of states and the default map engine.
}
```

Tip:
Press Tab to view a JS console window, and type into it 'log'
to view a log list of errors and warnings in your active code.

Finished Libraries
==================

- [x] radlib: the core library
- [x] radgui: the ui library
- [ ] radact: the action library
- [ ] radrpg: the rpg library

Credits
=======

 - Andrew "Radnen" Helenius
