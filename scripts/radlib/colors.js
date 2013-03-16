/**
* Script: colors.js
* Written by: Radnen
* Updated: 3/15/2013
**/

var Colors = ({
	white : CreateColor(255, 255, 255),
	red   : CreateColor(255,   0,   0),
	green : CreateColor(  0, 255,   0),
	blue  : CreateColor(  0,   0, 255),
	yellow: CreateColor(255, 255,   0),
	cyan  : CreateColor(  0, 255, 255),
	purple: CreateColor(255,   0, 255),
	black : CreateColor(  0,   0,   0),
	orange: CreateColor(255, 115,  50),
	gray  : CreateColor(125, 125, 125),
	
	transBlack : CreateColor(  0,   0,   0, 125),
	transRed   : CreateColor(255,   0,   0, 125),
	transYellow: CreateColor(255, 255,   0, 125),
	transGreen : CreateColor(  0, 255,   0, 125),
	transparent: CreateColor(255, 255, 255, 125),
	clear      : CreateColor(255, 255, 255, 0),
	
	fromAlpha: function(alpha, c) {
		return CreateColor(c.red, c.green, c.blue, alpha);
	}
});