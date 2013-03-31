/**
* Script: radparser.js
* Written by: Radnen
* Updated: 3/31/2013
**/

/* PRESENTLY HAND-ROLLED */

var RadParser = (function() {
	var current = 0, token = null;
			tokens = [], reg = [], stack = [];
	
	function GetNextToken() {
		token = tokens[current++];
	}
	
	// 1 token look-ahead
	function Peek() {
		return tokens[current];
	}
	
	function Ended() {
		return current == tokens.length;
	}
	
	function Print(expr) {
		this.expr = expr;
	}

	Print.prototype.eval = function() {
		Debug.alert("OUT: " + this.expr.eval());
	}

	function BinExpr(type, left, right) {
		this.t = type.tok;
		this.left = left;
		this.right = right;
	}

	BinExpr.prototype.eval = function() {
		var l = this.left.eval();
		var r = this.right.eval();
		switch (this.t) {
			case 43: return l + r;
			case 45: return l - r;
			case 42: return l * r;
			case 47: return l / r;
		}
	}

	function IntLit(type) {
		this._int = Number(type.val);
	}

	IntLit.prototype.eval = function() {
		return this._int;
	}

	function NextStmt() {
		GetNextToken();
		
		if (token.tok == PRINT) {
			GetNextToken();
			return new Print(NextADD());
		}
	}
	
	function NextADD() {
		var term = NextMUL();
		
		while (token) {
			if (token.tok == 43 || token.tok == 45) {
				var t = token;
				GetNextToken();
				term = new BinExpr(t, term, NextMUL());
			}
			else return term;
		}
	}
	
	function NextMUL() {
		var term = NextNUM();
		
		while(token) {
			if (token.tok == 42 || token.tok == 47) {
				var t = token;
				GetNextToken();
				term = new BinExpr(t, term, NextNUM());
			}
			else return term;
		}
	}
	
	function NextNUM() {
		if (token.tok == NUM) {
			var t = token;
			GetNextToken();
			return new IntLit(t);
		}
	}
	
	function Parse(toks) {
		token = null; current = 0;
		tokens = toks; reg = []; stack = [];
		toks.push( {tok: '$'.charCodeAt(0)} );
		return NextStmt();
	}
	
	return {
		parse: Parse
	}
}());