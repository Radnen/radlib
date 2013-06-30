/**
* Script: overlay.js
* Written by: Radnen
* Updated: 5/13/2013
**/

/**
* Note: This extends the RadLib Screen Object.
*  - Allows the use for cave light, darkness, or image overlays.
**/

RequireScript("RadRpg/screen.js");

Colors.cave = CreateColor(5  , 5  , 10 , 232);

Screen.overlays   = [];
Screen.isDark     = false;
Screen.nightMap   = CreateSurface(Lib.SW, Lib.SH, Colors.cave);
Screen.ceilingMap = null;
Screen.hasCeiling = false;
Screen.lights     = [];
Screen.lightsOn   = true;

Screen.removeAllOverlays = function() {
    this.overlays = [];
}

Screen.clear = function() {
    this.lights = [];
    this.lightsOn = true;
    this.ceilingMap = null;
}

Screen.purge = function() {
    this.ceilingMap = null;
    this.isDark = false;
    this.hasCeiling = false;
    this.lights = [];
    this.overlays = [];
    this.lightsOn = true;
}

Screen.addOverlay = function(image) {
    this.overlays.push(image);
}

Screen.renderOverlays = function() {
    if (this.isDark) this.drawLights();
    var i = this.overlays.length;
    while(i--) this.overlays[i].blit(MapToScreenX(0, 0), MapToScreenY(0, 0));
}

var g_screenClear = CreateColor(0, 0, 0, 0);
Screen.createLight = function(ID, r, x, y, col) {
    var light = {
        ID: ID,
        to: g_screenClear,
        from: (col) ? CreateColor(col.red, col.green, col.blue, col.alpha) : null,
        x: x,
        y: y,
        r: r,
        on: true
    };
    this.lights.push(light);
    return light;
}

/* Goes in an entities ON_CREATE code: */
Screen.generateLight = function(r, col) {
    var name = GetCurrentPerson();
    this.createLight(name, r, GetPersonX(name)+7, GetPersonY(name)+7, col);
}

// call when entering all affected maps, because they turn back on after switch.
Screen.turnOffAllLights = function() {
    this.lightsOn = false;
}

Screen.turnOffLight = function(name) {
    var l = List.get(this.lights, function(light) { return light.ID == name; });
	if (l) l.on = false;
}

Screen.removeLight = function(name) {
    List.remove(this.lights, function(light) { return light.ID == name; });
}

var c2 = CreateColor(0, 0, 0, 0);

Screen.drawLights = function() {
    if (this.hasCeiling && !this.ceilingMap) this.ceilingMap = GrabLayerSurface(3);

    this.nightMap.setBlendMode(REPLACE);
    this.nightMap.rectangle(0, 0, SW, SH, Colors.cave);
    this.nightMap.setBlendMode(SUBTRACT);
    
    var i, x, y, l;
    x = MapToScreenX(0, ActionEngine.x);
    y = MapToScreenY(0, ActionEngine.y);
    this.nightMap.gradientCircle(x, y, 80, Colors.white, Colors.clear);

    if (this.lightsOn) {
        i = this.lights.length;
        while(i--) {
            l = this.lights[i];
            x = MapToScreenX(0, l.x);
            y = MapToScreenY(0, l.y);
            if (!l.on || x < -l.r || y < -l.r || x > SW+l.r || y > SH+l.r) continue;
            
            this.nightMap.setBlendMode(SUBTRACT);
            this.nightMap.gradientCircle(x, y, l.r, Colors.white, c2);
            
            //this.nightMap.setBlendMode(BLEND);
            if (l.from) GradientCircle(x, y, l.r, l.from, c2); // this.nightMap.gradientCircle(x, y, l.r, l.from, c2);
        }
    }

    
    this.nightMap.blit(0, 0);
    if (this.hasCeiling) this.ceilingMap.blit(MapToScreenX(0, 0), MapToScreenY(0, 0));
}