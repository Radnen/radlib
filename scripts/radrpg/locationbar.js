/**
* Script: locationbar.js
* Written by: Radnen
* Updated: 6/30/2013
**/

var LocationBar = ({
	state: 3,
	color: CreateColor(255, 255, 255, 0),
	style: Lib.windowstyle,
	name: "",
	x: Lib.SW/2,
	y: 16,
	w: 0,
	h: 18,
	alpha: new Tween(),
	time: 0,
	
	showArea: function(areaname) {
		this.name = areaname;
		this.state = 0;
		this.w = Lib.font.getStringWidth(areaname);
		this.alpha.setup(0, 255, 500);
	},
	
	draw: function() {
		this.alpha.update();
		this.color.alpha = this.alpha.value;
		this.style.setColorMask(this.color);
		this.style.drawWindow(this.x-this.w/2-4, this.y-this.h/2, this.w+8, this.h);
		Lib.drawText(this.x-this.w/2, this.y-this.h/2+2, this.name, this.color);
	},
	
	render: function() {
		switch(this.state) {
			case 0:
				this.draw();
				if (this.alpha.isFinished()) { this.state++; this.time = GetTime(); }
			break;
			case 1:
				this.style.drawWindow(this.x-this.w/2-4, this.y-this.h/2, this.w+8, this.h);
				Lib.drawText(this.x-this.w/2, this.y-this.h/2+2, this.name);
				if (this.time + 2000 < GetTime()) {
					this.alpha.setup(255, 0, 500);
					this.state++;
				}
			break;
			case 2:
				this.draw();
				if (this.alpha.isFinished()) { this.state++; }
			break;
		}
	},
	
	clear: function() { this.state = 3; }
});