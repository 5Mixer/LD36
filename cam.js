var cam = {
	x: 0,
	y: 0,
	angle: 0,
	transform: function (c){
		c.save();
		c.translate(-this.x,-this.y);
		c.rotate(this.angle);
	},
	reset: function (c){
		c.restore();
	}
}
