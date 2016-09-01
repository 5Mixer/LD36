var villagerImg = new Image();
villagerImg.src = "assets/Villager.png";

var locations = {
	miner :
		[
			{ x: 84, y: 18},
			{ x: 88, y: 23},
			{ x: 100, y: 27},
			{ x: 110, y: 23},
			{ x: 118, y: 18},
		],
	farmer :
		[
			{ x: 16, y: 6},
			{ x: 30, y: 7},
			{ x: 44, y: 8},
			{ x: 45, y: 20},
			{ x: 50, y: 28},
			{ x: 49, y: 32},
			{ x: 40, y: 39},
			{ x: 26, y: 40},
			{ x: 11, y: 43}
		],
	"idle" :
		[
			{ x: 123, y: 60},
			{ x: 133, y: 60},
			{ x: 143, y: 60},
			{ x: 153, y: 60},
			{ x: 163, y: 60},
			{ x: 173, y: 60},
			{ x: 183, y: 60},
			{ x: 123, y: 70},
			{ x: 133, y: 70},
			{ x: 143, y: 70},
			{ x: 153, y: 70},
			{ x: 163, y: 70},
			{ x: 173, y: 70},
			{ x: 183, y: 70}
		]
}

var Villager = function (){
	this.role = "idle";
	this.name = randomName();
	this.food = 10;

	this.hut = undefined;

	var location = locations[this.role][0];
	this.x = location.x*2; //Because the map is scale x2.
	this.y = location.y*2;

	// for (var i=0; i < village.possesions.huts.length; i++){
	// 	//If the hut isn't full, put player in it.
	// 	if (village.possesions.huts[i].inhabitants.length < village.possesions.huts[i].maxSize){
	// 		this.hut = village.possesions.huts[i];
	// 		village.possesions.huts[i].inhabitants.push(this);
	// 		break;
	// 	}
	// }

	this.roleNumber = 0; //1 = 1st miner/farmer/idler. There is a '0' for each role. *NOT UNIQUE*
}
Villager.prototype.draw = function(c){
	var location = locations[this.role][0];

	if (locations[this.role].length > this.roleNumber){
		location = locations[this.role][this.roleNumber];
	}
	this.x = location.x*2; //Because the map is scale x2.
	this.y = location.y*2;

	c.drawImage(villagerImg, 0,0,8,8, this.x, this.y, 16,16);
}
