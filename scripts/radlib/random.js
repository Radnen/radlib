/*
* Script: random.js
* Written by: Radnen
* Updated: 6/3/2013
*/

function RandomGenerator(seed) {
	const MAX  = 2147483647;
	const MULT = 48271;
	const Q    = Math.floor(MAX / MULT);
	const R    = Math.floor(MAX % MULT);
	
	this.seed  = seed || Date.now();

	this.next = function() {
		var t = MULT * (this.seed % Q) - R * (this.seed / Q);
		this.seed = (t > 0) ? t : t + MAX;
		return (this.seed / MAX);
	}
}