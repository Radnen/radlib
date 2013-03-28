/**
* Script: image.js
* Written by: Andrew Helenius
* Updated: 3/27/2013
**/

/**
* RadImage(image : image);
* - creates an image wrapper that has access to
*   pixel-perfect lookup and various blitting modes.
**/
function RadImage(image)
{
	if (!image || image.toString() != "[object image]") {
		Debug.alert("Arg0 not of Sphere image type.");
		return;
	}
	
	this.base_image = image;
	this.image = image;
	this.canvas = null;
	this.r = 0;
	this.z = 0;
	
	this.__defineGetter__("width", function() { return this.base_image.width * this.z; });
	this.__defineGetter__("height", function() { return this.base_image.height * this.z; });
}

RadImage.prototype.blit = function(x, y, m) {	
	if (m)
		this.image.blitMask(x, y, this.mask);
	else
		this.image.blit(x, y);
}

RadImage.prototype.rotateBlit = function(x, y, r, m) {
	if (m)
		this.image.rotateBlitMask(x, y, r, m);
	else
		this.image.rotateBlit(x, y, r);
}

RadImage.prototype.zoom = function(z) {
	if (this.z != z) {
		this.canvas = this.base_image.createSurface();
		this.image = this.canvas.rescale(this.base_image.width * z, this.base_image.height * z).createImage();
		this.z = z;
	}
}

RadImage.prototype.collidesWith = function(x1, y1, radimg, x2, y2) {
	// setup positions:
	var top    = Math.max(y1, y2);
	var left   = Math.max(x1, x2);
	var right  = Math.min(x1 + this.width , x2 + radimg.width )-1;
	var bottom = Math.min(y1 + this.height, y2 + radimg.height)-1;
	
	// collision:
	var colA, colB;
	for (var y = top; y < bottom; ++y) {
		for (var x = left; x < right; ++x)
		{
			colA = this.canvas.getPixel(x - x1, y - y1);
			colB = radimg.canvas.getPixel(x - x2, y - y2);
			if (colA.alpha > 0 && colB.alpha > 0) return true;
		}
	}
	
	return false;
}