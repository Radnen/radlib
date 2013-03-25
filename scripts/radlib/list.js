/**
* Script: list.js
* Written by: Radnen
* Updated: 3/25/2013
**/

RequireScript("radlib/assert.js");
RequireScript("radlib/debug.js");

var List = (function() {
	/**
	* Check(array : array, predicate : function); <internal>
	*  - Macro that checks the validity of arrays and predicates. 
	**/
	function Check(array, predicate) {
		if (!Assert.isArray(array)) {
			Debug.log("Array not of array type.", LIB_ERROR);
			return false;
		}
		if (predicate && !Assert.is(predicate, "function")) {
			Debug.log("Predicate not of function type.", LIB_ERROR);
			return false;
		}
		return true;
	}
	
	/**
	* contains(array : array, predicate : function);
	*  - Use this to see if an item is in the array.
	*  - Use the predicate to determine the search.
	*    have it return true on a match, or otherwise false.
	**/
	function contains(array, predicate) {
		if (!Check(array, predicate)) return;

		var i = array.length;
		while (i--) { if (predicate(array[i])) return true; }
		return false;
	}
	
	/**
	* foreach(array : array, func : function, owner : object);
	*  - Use this to loop through an array.
	*  - have the function do something on each iteration.
	*    it's argument list has: the item, the index, and the array.
	**/
	function foreach(array, func, owner) {
		if (!Check(array)) return;
		
		for (var i = 0, l = array.length; i < l; ++i)
			func.call(owner, array[i], i, array);
			
		return array;
	}

	function iterate(array, func, owner) {
		if (!Check(array)) return;
			
		for (var i = 0, l = array.length; i < l; ++i) {
			var delta = func.call(owner, array[i], i, array);
			if (Assert.is(delta, "number")) i += delta;
			else if (!Assert.is(delta, "undefined")) return delta;
		}
	}
	
	/**
	* map(array : array, func : function);
	*  - alters the array by performing the function on each element.
	*  - It returns a new array.
	**/
	function map(array, func) {
		if (!Check(array)) return;

		var B = new Array(array.length);
		foreach(array, function(item, idx) {
			B[idx] = func(item);
		});
		return B;
	}
	
	/**
	* remove(array : array, predicate : function);
	*  - removes an item that matches the predicate.
	**/
	function remove(array, predicate) {
		if (!Check(array, predicate)) return;
		var i = array.length;
		while (i--) {
			if (predicate(array[i])) array.splice(i, 1);
		}
		return array;
	}
	
	/**
	* remove(array : array, i : integer);
	*  - simply removes the 'i'th element from the array.
	**/
	function removeAt(array, i) {
		if (!Check(array)) return;
		array.splice(i, 1);
	}
	
	/**
	* indexOf(array : array, predicate : function);
	*  - Use this to get the index of an item in an array.
	**/
	function indexOf(array, predicate) {
		if (!Check(array, predicate)) return;
		var idx = -1;
		foreach(array, function(item, i) {
			if (predicate(item)) idx = i;
		});
		return idx;
	}
	
	/**
	* random(array : array);
	*  - returns a random element from the array.
	**/
	function random(array) {
		if (!Check(array)) return;
		return array[Math.floor(Math.random()*array.length)];
	}
	
	/**
	* get(array : array, predicate : function);
	*  - Use this to get the item in an array that satisfies the predicate.
	**/
	function get(array, predicate) {
		if (!Check(array, predicate)) return;
		return array[indexOf(array, predicate)];
	}

	return {
		contains: contains,
		foreach: foreach,
		get: get,
		iterate: iterate,
		indexOf: indexOf,
		map: map,
		random: random,
		remove: remove,
		removeAt: removeAt,
	};
}());
