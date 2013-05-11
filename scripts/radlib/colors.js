/**
* Script: colors.js
* Written by: Radnen
* Updated: 5/9/2013
**/

var Colors = ({
	black      : CreateColor(0  , 0  , 0  ),
	white      : CreateColor(255, 255, 255),
	gray       : CreateColor(125, 125, 125),
	lightGray  : CreateColor(180, 180, 180),
	darkGray   : CreateColor(96 , 96 , 96 ),
	red        : CreateColor(255, 0  , 0  ),
	green      : CreateColor(0  , 255, 0  ),
	blue       : CreateColor(0  , 0  , 255),
	cyan       : CreateColor(0  , 255, 255),
	purple     : CreateColor(255, 0  , 255),
	yellow     : CreateColor(255, 255, 0  ),
	orange     : CreateColor(200, 125, 50 ),
	brown      : CreateColor(100, 60 , 40 ),
    
    transBlack : CreateColor(  0,   0,   0, 125),
    transRed   : CreateColor(255,   0,   0, 125),
    transYellow: CreateColor(255, 255,   0, 125),
    transGreen : CreateColor(  0, 255,   0, 125),
    transparent: CreateColor(255, 255, 255, 125),
    clear      : CreateColor(255, 255, 255, 0),
    
    fromAlpha: function(alpha, c) {
        return CreateColor(c.red, c.green, c.blue, alpha);
    },
    
    // returns null if color not found:
    fromName: function(string) {
        if (string in this) return this[string];
        return null;
    }
});