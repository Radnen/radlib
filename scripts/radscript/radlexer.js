/**
* Script: radlexer.js
* Written by: Radnen
* Updated: 3/31/2013
**/

var RadLexer = (function() {
	var code = [], current = 0,
	    token = '', contents = "",
			regs = [], lines = 1;
	
	function Open(filename) {
		var file = OpenRawFile(filename);
		contents = CreateStringFromByteArray(file.read(file.getSize()));
		contents += "\n\0";
		file.close();
	}
		
	function Token(type, value) {
		this.tok = type;
		this.val = value;
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
		code = []; current = 0; token = ''; lines = 1;
		var str = "";
		
		Next();
		while (token != '\0') {
			if (token == '\n') lines++;
			
			str += token;
			for (var i = 0; i < regs.length; ++i) {
				if (regs[i].r.test(str)) {
					if (!regs[i].r.test(str + Peek())) {
						if (regs[i].t > 0) code.push(new Token(regs[i].t, str));
						if (regs[i].t == ERROR) Abort("Syntax Error: " + str + " on line " + lines);
						str = "";
					}
					break;
				}
			}
			Next();
		}
		
		Abort(code.toSource());
	}
	
	function Lex(filename) {
		Open(filename);
		Begin();
	}
	
	return {
		lex: Lex,
		register: Register,
		tokens: code
	};
}());