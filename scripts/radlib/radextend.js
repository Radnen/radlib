/**
* Script: radextend.js
* Written by: Radnen
* Updated: 3/13/2013
**/

// These functions extend the flexibility of radlib.
// The only place where named functions reside.

/**
* Delegate(func : function, owner : object);
*  - Used to bind an owner to a function.
*  - commonly used to redirect the 'this' pointer.
**/
function Delegate(func, owner) {
	return function() { func.call(owner); }
}

/**
* Absorb(A : object, B : object);
*  - Puts members of B into A, returning A.
**/
function Absorb(A, B) {
	for (var i in B) A[i] = B[i];
	return A;
}

/**
* FormatString(s : string);
*  - Replaces any occurance of {?} to some value beginning the
*    next position of the poarameter list. Like C's printf function.
*  - ex: FormatString("Hello {?}! {?}", "World", 5) -> "Hello World! 5"
**/
function FormatString(s) {
	var a = arguments, i = 1;
	return s.replace(/{\?}/g, function() { return a[i++]; });
}

/**
* Serialize(obj : object);
*  - Use this to JSON an object; AND preserve the data type.
**/
function Serialize(obj)
{
	function Make(obj) {
		var o = { zztype: obj.constructor.name };
		for (var i in obj) {
			if (!Assert.isArray(obj[i]) && Assert.is(obj[i], "object"))
				o[i] = Make(obj[i]);
			else
				o[i] = obj[i];
		}
		return o;
	}
	
	return JSON.stringify(Make(obj));
}

/**
* Deserialize(s : string);
*  - Use this to parse a JSON object; AND restore the methods.
**/
function Deserialize(s)
{
	function Make(o) {
		Debug.log(o.zztype);
		var f = new Function("return new " + o.zztype + "();");
		var obj = f();
		for (var i in o) {
			if (!Assert.isArray(o[i]) && Assert.is(o[i], "object"))
				obj[i] = Make(o[i]);
			else
				obj[i] = o[i];
		}
		return obj;
	}
	
	return Make(JSON.parse(s));
}

/**
* ShallowClone(obj : object);
*  - generates a shallow copy of the object.
**/
function ShallowClone(obj) {
	var f = new Function("return new " + obj.constructor.name + "();");
	var o = f();
	Absorb(o, obj);
	return o;
}

/**
* DeepClone(obj : object);
*  - generates a full, deep, and accurate copy of the object.
**/
function DeepClone(obj) {
	return Deserialize(Serialize(obj));
}

/**
* RequireFolder(foldername : string);
*  - Convenience function that loads all scripts in a folder.
*    Be careful though, it won't resolve dependencies, but still
*    good for loading files dynamically.
**/
function RequireFolder(foldername) {
	var files = GetFileList("~/scripts/" + foldername);
	for (var i = 0; i < files.length; ++i) RequireScript(foldername+"/"+files[i]);
}