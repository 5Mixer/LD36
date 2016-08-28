var hutImg = new Image();
hutImg.src = "Hut.png";

Hut = function(){
	this.x = 0;
	this.y = 0;
	this.inhabitants = [];
	this.maxSize = 5;
	this.hutNumber = 0;
}
Hut.prototype.draw = function(c){
	var location = locations[this.role][0];

	if (locations[this.role].length > this.hutNumber){
		location = locations[this.role][this.hutNumber];
	}
	this.x = location.x*2; //Because the map is scale x2.
	this.y = location.y*2;

	c.drawImage(villagerImg, 0,0,8,8, this.x, this.y, 16,16);
}
