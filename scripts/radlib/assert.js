/**
* Script: assert.js
* Written by: Radnen
* Updated: 3/29/2013
**/

/**
* Assert Package
* ============================================
* - Provides testing methods, used for
*   debugging, general correctness, and type
*   checking.
*/

var Assert = (function(){
	var f_reg = /function ([^\(]+)/;
	
	function CheckArgs(arg_list) {
		var list = [], passed = true;

		// Convert JS arguments array to an array:
		for (var i = 1; i < arguments.length; ++i) list.push(arguments[i]);
		
		List.foreach(list, function(a, i) {
			if (i < arg_list.length && a != '*' && !Is(arg_list[i], a)) {
				if (Is(a, "function")) { a = f_reg.exec(a.toString())[1]; }
				Debug.log("Arg{?} not of {?} type.", i, a, LIB_ERROR);
				passed = false;
			}
		});
		
		return passed;
	}
	
	function Is(obj, other) {
		if (typeof other == "string") return typeof obj == other;
		if (typeof other == "function") return obj instanceof other;
	}
	
	function IsNullOrEmpty(str) {
		return !str || str == "";
	}
	
	function Equals(o1, o2) {
		return o1 === o2;
	}
	
	function IsArray(arr) {	
		return arr instanceof Array;
	}
	
	function True(test, message) {
		if (!test) Debug.log("Error: " + message);
	}

	function False(test, message) {
		if (test) Debug.log("Error: " + message);
	}
	
	function IsSphereObject(obj) {
		if (!obj) return false;
		switch (obj.toString()) {
			case "[object Image]":
			case "[object Font]":
			case "[object Spriteset]":
			case "[object Windowstyle]":
			case "[object Sound]":
				return true;
			break;
		}
		return false;
	}
	
	function fileExists(path, filename) {
		return List.contains(GetFileList(path), function(file) { return filename == file; });
	}
	
	return {
		assertFalse: False,
		assertTrue: True,
		checkArgs: CheckArgs,
		equals: Equals,
		fileExists: fileExists,
		is: Is,
		isArray: IsArray,
		isNullOrEmpty: IsNullOrEmpty,
		isSphereObject: IsSphereObject
	};
})()