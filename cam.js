var cam = {
	x: 0,
	y: 0,
	targetx: 0,
	targety: 0,
	angle: 0,
	transform: function (c){
		this.x += (this.targetx-this.x)/4;
		this.y += (this.targety-this.y)/4;
		c.save();
		c.translate(-this.x,-this.y);
		c.rotate(this.angle);
	},
	reset: function (c){
		c.restore();
	}
}
