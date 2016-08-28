var hutImg = new Image();
hutImg.src = "Hut.png";

var hutLocations = [
	{x : 137, y: 21},
	{x : 144, y: 36},
	{x : 134, y: 49},
	{x : 154, y: 11},
	{x : 164, y: 31},
	{x : 158, y: 50},
	{x : 176, y: 50},
	{x : 180, y: 41}
]

var Hut = function(hutNumber){
	this.x = 0;
	this.y = 0;
	this.inhabitants = [];
	this.maxSize = 3;
	this.hutNumber = hutNumber;
}
Hut.prototype.draw = function(c){
	var location = hutLocations[0];

	if (hutLocations.length > this.hutNumber){
		location = hutLocations[this.hutNumber];
	}
	this.x = location.x*2; //Because the map is scale x2.
	this.y = location.y*2;

	c.drawImage(hutImg, 0,0,32,32, this.x, this.y, 64,64);
}
