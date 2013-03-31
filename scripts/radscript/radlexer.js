/**
* Script: radlexer.js
* Written by: Radnen
* Updated: 3/31/2013
**/

var RadLexer = (function() {
	var code = [], current = 0,
	    token = '', contents = "",
      regs = [], lines = 1, chars = 0;

	function Open(filename) {
		var file = OpenRawFile(filename);
		contents = CreateStringFromByteArray(file.read(file.getSize()));
		contents += "\n\0";
		file.close();
	}
	
	function Token(type, value) {
		return {
			tok: type,
			val: value,
			line: lines,
			ch: chars
		};
	}

	function Next() {
		token = contents[current++];
	}
	
	function Peek() {
		return contents[current];
	}

	function Register(regex, token) {
		if (Assert.is(token, "string")) token = token.charCodeAt(0);
		regs.push({ r: regex, t: token });
	}

	function Begin() {
		code = []; current = 0; token = ''; lines = 1; chars = 0;
		var str = "", regex;
		
		Next();
		while (token != '\0') {
			if (token == '\n') { chars = 0; lines++; }
			
			str += token;
			for (var i = 0; i < regs.length; ++i) {
				regex = regs[i];
				if ( regex.r.test( str ) ) {
					if ( !regex.r.test( str + Peek() ) ) {
						if ( regex.t > 0 ) code.push( Token(regex.t, str) );
						
						if ( regex.t == ERROR )
							Abort("Syntax Error: " + str + " on line " + lines);
						
						str = "";
					}
					break;
				}
			}
			Next();
			chars++;
		}
	}
	
	function Lex(filename) {
		Open(filename);
		Begin();
		return code;
	}
	
	return {
		lex: Lex,
		register: Register,
		tokens: code
	};
}());