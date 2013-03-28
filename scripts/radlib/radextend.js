/**
* Script: radextend.js
* Written by: Andrew Helenius
* Updated: 3/27/2013
**/

/**
* Event Package
* ============================================
* - .NET like event delegation object. Attach
*   to it methods or functions that may
*   eventually be called by the containing
*   object.
*/

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
		var o = Assert.isArray(obj) ? [] : { zztype: obj.constructor.name };
		
		for (var i in obj) {
			if (Assert.is(obj[i], "object")) o[i] = Make(obj[i]);
			else o[i] = obj[i];
		}
		
		return o;
	}
	
	if(Assert.is(obj, "object"))
		return JSON.stringify(Make(obj));
	else
		return JSON.stringify(obj);
}

/**
* Deserialize(s : string);
*  - Use this to parse a JSON object; AND restore the methods.
**/
function Deserialize(s)
{
	function Make(o) {
		var obj = [];
		
		if (!Assert.isArray(o)) {
			if (o.zztype in this) obj = new global[o.zztype]();
			else {
				Debug.log("Can't deserialize type: {?}", o.zztype, LIB_ERROR);
				return;
			}
		}
		
		for (var i in o) {
			if (Assert.is(o[i], "object")) obj[i] = Make(o[i]);
			else obj[i] = o[i];
		}
		
		if (!Assert.isArray(obj)) delete obj.zztype;
		return obj;
	}
	
	return Make(JSON.parse(s));
}

/**
* ShallowClone(obj : object);
*  - generates a shallow copy of the object.
**/
function ShallowClone(obj) {
	var o = new global[obj.constructor.name]();
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
function RequireFolder(folder) {
	if (!Assert.is(folder, "string")) {
		Debug.log("Arg0 not of string type.", LIB_ERROR); return;
	}
	
	if (Assert.isNullOrEmpty(folder)) {
		Debug.log("Arg0 is an empty string.", LIB_WARN); return;
	}
		
	List.foreach(GetFileList("~/scripts/" + folder), function(item) {
		RequireScript(folder + "/" + item);
	});
}

/**
* CreateRectangle(width : number, height : number, color : color);
*  - creates a rectangle that is stored to memory, an optimization
*    technique so you don't have to draw large rectangles to screen.
**/
function CreateRectangle(width, height, color) {
	if (!width || !Assert.is(width, "number")) {
		Debug.log("Arg0 not of number type or 0", LIB_ERROR); return;
	}
	
	if (!height || !Assert.is(height, "number")) {
		Debug.log("Arg1 not of number type or 0", LIB_ERROR); return;
	}
	
	if (!color || color.toString() != "[object color]") {
		Debug.log("Arg2 not of color type.", LIB_ERROR); return;
	}

	return CreateSurface(width, height, color).createImage();
}

/**
* - Similar to the above but for gradients.
**/
function CreateGradient(w, h, ur, ul, lr, ll)
{
	var surf = CreateSurface(w, h, Colors.white);
	surf.gradientRectangle(0, 0, w, h, ur, ul, lr, ll);
	return surf.createImage();
}

/**
* CreateRectangle(width : number, height : number, color : color);
*  - scales a preexisting Sphere image to a new size.
*  - intended as an optimization technique.
**/
function CreateScaledImage(image, width, height)
{
	if (!image || !image.toString() == "[object image]") {
		Debug.log("Arg0 not of image type.", LIB_ERROR); return;
	}
	
	if (!width || !Assert.is(width, "number")) {
		Debug.log("Arg1 not of number type or 0", LIB_ERROR); return;
	}
	
	if (!height || !Assert.is(height, "number")) {
		Debug.log("Arg2 not of number type or 0", LIB_ERROR); return;
	}
	
	return image.createSurface().rescale(width, height).createImage();
}