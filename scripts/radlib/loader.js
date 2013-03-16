/**
* Script: loader.js
* Written by: Unknown
* Updated: 3/9/2013
**/

var Loader = (function() {
	var bg = null;
	
	function DrawProgress(msg) {
		if (bg) bg.blit(0, 0);
		var count = FormatString("Loading: {?}", msg);
		Lib.drawText(Lib.SW/2-Lib.font.getStringWidth(count)/2, Lib.SH/2-Lib.font.getHeight()/2, count);
		FlipScreen();
	}
	
	function SetBG(image) {
		bg = image;
	}
	
	return {
		setBG: SetBG,
		drawProgress: DrawProgress
	}
})();