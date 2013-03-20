/**
* Script: debug.js
* Written by: Unknown
* Updated: 3/20/2013
**/

RequireScript("radlib/game.js");

const LIB_NORM  = 0;
const LIB_GOOD  = 1;
const LIB_WARN  = 2;
const LIB_ERROR = 3;

var Debug = (function() {
	var ptr = 0;
	var stack = [];
	var log = [];
	var bg = null;
	var logtext = "Log: " + new Date().toDateString();
	
	// returns true if it breaks the draw loop:
	function Input(key) {
		switch (key) {
			case KEY_ESCAPE: Exit(); return true; break;
			case KEY_LEFT:
				if (ptr > -1) ptr--;
				if (ptr == -1) {
					ShowLog();
					return true;
				}
				else {
					ShowStack(stack[ptr]);
					return true;
				}
			break;
			case KEY_ENTER:
				ptr = (ptr == -1) ? ptr = stack.length-1 : -1;
				if (ptr == -1) {
					ShowLog();
					return true;
				}
				else {
					ShowStack(stack[ptr]);
					return true;
				}
			break;
			default: // also covers KEY_RIGHT.
				if (ptr < stack.length - 1) { 
					ptr++;
					ShowStack(stack[ptr]);
				}
				return true;
			break;
		}
		
		return false;
	}
		
	function DrawFooter() {
		Line(2, Lib.SH-18, Lib.SW-4, Lib.SH-18, Lib.colors.debugText);
		Lib.drawText(5, Lib.SH-16, "ESC = quit, L/R = flip, ENTER = log", Lib.colors.debugText);
		var posText = (ptr+1) + "/" + stack.length;
		Lib.drawText(Lib.SW-Lib.font.getStringWidth(posText)-5, Lib.SH-16, posText, Lib.colors.debugText);
	}
	
	function ShowLog() {
		if (StateManager.isRunning() && this.LogState != undefined) {
			var ls = new LogState(log);
			ls.show();
			Debug.open = false;
			return;
		}
		
		SetClippingRectangle(0, 0, Lib.SW, Lib.SH);
		ptr = -1;
		var exit = false;
		var h = Lib.SH/20 - 1;
		var top = 0;
		
		if (!bg)
			bg = CreateGradient(Lib.SW, Lib.SH, Lib.colors.debugBG1, Lib.colors.debugBG1, Lib.colors.debugBG2, Lib.colors.debugBG2);
		
		while(AreKeysLeft()) GetKey();
		while(!exit) {
			bg.blit(0, 0);
			Line(Lib.SW-20, 0, Lib.SW-20, Lib.SH-20, Lib.colors.debugText);
			var factor = Math.max(1, log.length - h + 1);
			Rectangle(Lib.SW-20, 2 + (Lib.SH-40) / factor * top, 20, 20, Lib.colors.debugText);
			
			var texth = 8 - Lib.font.getHeight()/2;
			
			for (var i = 0; i < h; ++i) {
				if (!log[i + top]) continue;
				Line(2, 20+i*20, Lib.SW-20, 20+i*20, Lib.colors.debugText);
				
				var msg = log[i + top].msg;
				var type = log[i + top].state;
				var color = Lib.colors.debugText;
				
				if (type == LIB_ERROR) color = Lib.colors.error;
				if (type == LIB_WARN ) color = Lib.colors.warning;
				if (type == LIB_GOOD ) color = Lib.colors.good;

				if (Lib.font.getStringWidth(msg) > Lib.SW-21) {
					while (Lib.font.getStringWidth(msg + "...") > Lib.SW-40) msg = msg.substring(0, msg.length-1);
					msg += "..."; // cache here
				}
				
				if (Resources.images.orb)
					Resources.images.orb.blitMask(5, 2+texth+i*20, color);
				
				Lib.drawText(5+16, 2+texth+i*20, msg, color);
				Lib.drawCursor();
			}
			
			DrawFooter();
			
			FlipScreen();
			
			while(AreKeysLeft()) {
				var key = GetKey();
				switch (key) {
					case KEY_UP: if (top > 0) top--; break;
					case KEY_DOWN: if (top < log.length - h+1) top++; break;
					default:
						exit = Input(key);
					break;
				}
			}
		}
	}
		
	function ShowStack(stackObj) {
		SetClippingRectangle(0, 0, Lib.SW, Lib.SH);
		var exit = false;
		if (!bg)
			bg = CreateGradient(Lib.SW, Lib.SH, Lib.colors.debugBG1, Lib.colors.debugBG1, Lib.colors.debugBG2, Lib.colors.debugBG2);

		while(AreKeysLeft()) GetKey();
		while(!exit) {
			bg.blit(0, 0);

			Line(2, 20, Lib.SW - 4, 20, Lib.colors.debugText);
					
			Lib.drawText(5, 5, stackObj.title, Lib.colors.debugText);
			Lib.font.drawTextBox(5, 25, Lib.SW, Lib.SH, 0, stackObj.o.toString());
			
			DrawFooter();
			
			FlipScreen();

			while (AreKeysLeft()) exit = Input(GetKey());
		}
	}
		
	function GetInfoString(prefix, line) {
		var text = line;
		var num = Number(line.split(":")[1]) + 1;
				
		if (line.length == 3) {
			line = "Anonymous Call";
			num = "";
		}
		else {
			if (Lib.SW >= 400)
				line = text.replace(/@/, ", ").substring(0, text.indexOf(':')+1); // long
			else
				line = text.substring(text.indexOf('@')+1, text.indexOf(':'));    // short
		}
		
		return FormatString("{?}{?}, line: {?}", prefix, line, num);
	}

	function Alert(obj, title) {
		if (title === undefined) {
			var line = (new Error()).stack.split("\n")[2];
			title = GetInfoString("Alert: ", line);
		}
							
		if (obj === undefined) obj = "undefined";
		if (obj === null) obj = "null";
		
		stack.push( {o: obj, title: title} );
		ptr = stack.length - 1;

		if (!Debug.silent) ShowStack(stack[ptr]);
	}
	
	function MyAbort(obj, indirection) {
		if (indirection === undefined) indirection = 0;
		var line = (new Error()).stack.split("\n")[2+indirection];
		var title = GetInfoString("Abort: ", line);
		
		if (obj === undefined) obj = "undefined";
		if (obj === null) obj = "null";
		
		stack.push( {o: obj, title: title} );
		ptr = stack.length - 1;
		
		ShowStack(stack[ptr]);
		Exit();
	}
		
	function Log(str, state) {
		if (!state) state = LIB_NORM;
		
		var s = new Error().stack.split("\n"), t;
		s.shift(); s.shift();
		
		for (var i = 0; i < s.length; ++i) {
			if (!s[i]) { s.splice(i, 1); i--; continue; }
			t = s[i].split("@")[1].split(":");
			if (t[0].length > 0)
				s[i] = (i + 1) + ". " + t[0] + ": " + (Number(t[1])+1); // correct line numbers
			else
				{ s.splice(i, 1); i--; }
		}
		
		log.push({msg: str, state: state, stack: s});
	}
	
	function ShowLast() {
		if (stack.length - 1 == -1)
			ShowLog();
		else
			ShowStack(stack[stack.length - 1]);
	}
		
	var tracking = [];
	function Track(text) {
		if (!Debug.open) return;
		tracking.push(text);
	}
	
	var m_idx = 0;
	var msgs = [];
	var consoletext = "";
	
	function RenderConsole() {
		if (!Debug.open) return;
		Rectangle(0, 0, Lib.SW, 16, Lib.colors.debugBG2);
		Line(0, 16, Lib.SW, 16, Lib.colors.debugText);
		
		var h = 8 - Lib.font.getHeight()/2;
		
		Lib.drawText(2, h, "Console: " + consoletext, Lib.colors.debugText);
		
		var date = new Date();
		if (date.getMilliseconds() > 500)
			Lib.drawText(2 + Lib.font.getStringWidth("Console: " + consoletext), h, "|", Lib.colors.debugText);
			
		Rectangle(0, Lib.SH-16, Lib.SW, 16, Lib.colors.debugBG2);
		Line(0, Lib.SH-16, Lib.SW, Lib.SH-16, Lib.colors.debugText);

		var info = tracking.join(" | ");
		Lib.drawText(2, Lib.SH - 16 + h, info, Lib.colors.debugText);
		tracking = [];
	}
	
	var registered = {};
	
	function Register(name, action) { registered[name.toLowerCase()] = action; }
	
	function UpdateConsole(key) {
		if (!Debug.open) {
			if (key == KEY_TAB) Debug.open = !Debug.open;
			return;
		}
		
		switch(key) {
			case KEY_TAB: Debug.open = !Debug.open; break;
			case KEY_UP:
				if (m_idx < msgs.length) {
					consoletext = msgs[m_idx];
					m_idx++;
				}
			break;
			case KEY_DOWN:
				if (m_idx > 1) {
					m_idx--;
					consoletext = msgs[m_idx];
				}
				else if (m_idx > 0) { consoletext = ""; m_idx = 0; }
			break;
			case KEY_ENTER:
				var func;
				if (consoletext.toLowerCase() in registered)
					func = registered[consoletext.toLowerCase()];
				else
					func = new Function(consoletext);

				try { func(); }
				catch(e) { Debug.alert(e); }
				finally { msgs.unshift(consoletext); consoletext = ""; }
			break;
			case KEY_BACKSPACE:
				consoletext = consoletext.substr(0, consoletext.length-1);
			break;
			default:
				consoletext += GetKeyString(key, IsKeyPressed(KEY_SHIFT));
			break;
		}
	}
	
	return {
		silent: false,
		alert: Alert,
		abort: MyAbort,
		open: false,
		extra: false,
		log: Log,
		renderConsole: RenderConsole,
		updateConsole: UpdateConsole,
		registerConsoleAction: Register,
		track: Track,
		showLastError: ShowLast,
		showLog: ShowLog,
	};
})();

Debug.registerConsoleAction("Log", Debug.showLog);
Debug.registerConsoleAction("Errors", Debug.showLastError);
Debug.registerConsoleAction("TOM", function() { Debug.extra = !Debug.extra; });
Debug.registerConsoleAction("Exit", Exit);

// experimental:
/*Abort = function(message) {
	Debug.abort(message, 1);
}*/