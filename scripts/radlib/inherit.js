/**
* Script: inherit.js
* Written by: Radnen
* Updated: 3/13/2013
**/

/**
* Inherit Package
* ============================================
* - Simple object inheritance interface. Used
*   to quickly construct data models for your
*   video game that relies on inheriting data.
*/

/**
* Inherit(base : object, extend : object);
*  - Use this to simulate OOP. Create subclasses
*    of 'base' by using the 'extend' object.
**/
function Inherit(base, extend)
{
	function Extend() {
		Absorb(this, extend);
		this.parent = base;
		if (this.init) this.init.apply(this, arguments);
		this.parent = base.prototype;
	}

	Extend.prototype = new base();
	
	return Extend;
}

/*var Car = function() {
	this.name = "car";
	this.look = true;
}

Car.prototype.drive = function() {
 Abort("driving " + this.name + "!");
}

var Truck = Inherit(Car, {
	inventory: [],
});

var Plane = Inherit(Car, {
	init: function(param) {
		this.name = param;
	},
	
	shoot: function() {
		//Car.prototype.drive.call(this);
		this.parent.drive.call(this);
	},
	
	drive: function() {
		Abort("more like flying to me.");
	},
});

var t = new Truck();
var p = new Plane("plane");

//p.shoot();
Abort(p.toSource());

/* Test: ************************* Result:
* p instanceof Truck------------: false
* p inctanceof Car .............: true
* p instanceof Plane -----------: true
* p instanceof Object ..........: true
* p.shoot() --------------------: "driving plane"
* p.drive() ....................: "more like flying to me."
* JSON.stringify(d) ------------: { name: "car", inventory: [] }
* t.hasOwnProperty("drive") ....: false
********************************/

