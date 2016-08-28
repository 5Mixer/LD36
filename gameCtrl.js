
app.controller('gameCtrl', function($scope,village){

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

	$scope.$watch( function () { return village.possesions.villagers; }, function (villagers) {

		var numVillagers = villagers.length;
		var avaliableScythes = village.getMaterial("scythe").number;
		var avaliablePickaxes = village.getMaterial("pickaxe").number;
		for (var i = 0; i < numVillagers; i++){
			if (avaliableScythes > 0){
				villagers[i].role = "farmer";
				avaliableScythes--;
				continue;
			}
			if (avaliablePickaxes > 0){
				avaliablePickaxes--;
				villagers[i].role = "miner";
				continue;
			}
			villagers[i].role = "";
		}

	 }, true);


	$scope.day = village.world.day;

	var cdom = document.getElementById("canvas");
	var c = cdom.getContext("2d");

	function nearestPow2( aSize ){
	  return Math.pow( 2, Math.round( Math.log( aSize ) / Math.log( 2 ) ) );
	}

	cdom.setAttribute('width', Math.floor(window.getComputedStyle(cdom).width/100)*100);
	cdom.setAttribute('height', Math.floor(cdom.width/2));

	cdom.imageSmoothingEnabled = false;

	var tick = function(){
		village.world.day++;

		village.world.weather = Math.sin(village.world.day)+(Math.random()*.25)-.125 > 0.5 ? "sun" : "rain";

		if (village.world.weather == "sun" && village.world.cropsMoisture > -2){
			village.world.cropsMoisture--;
		}
		if (village.world.weather == "rain" && village.world.cropsMoisture < 2){
			village.world.cropsMoisture++;
		}

		var playerLength = village.possesions.villagers.length;
		for (var i=0; i<playerLength; i++){

			village.addMaterial("food",1)

		}
		if (village.world.day % 5 == 0){
			var n = playerLength;
			while (n--){
				village.possesions.villagers[n].food--;
				if (village.possesions.villagers[n].food < 1){
					//village.addMaterial("food",-9)
					village.possesions.villagers.splice(n,1);
				}

			}
		}

		$scope.$apply();
	}

	setInterval(tick, 2000);

	var img = new Image();
	img.src = "Land.png";


	var vignette = new Image();
	vignette.src = "Vignette.png";

	//setInterval(tick, 2000);

	c.mozImageSmoothingEnabled = false;
	c.webkitImageSmoothingEnabled = false;
	c.msImageSmoothingEnabled = false;
	c.imageSmoothingEnabled = false;


	console.log(cdom.width)

	var t = 0;
	var update = function () {
		t++;

		cam.transform(c);
		c.drawImage(img, 0,0,200,100,0, 0, 400, 200);
		cam.reset(c);

		c.save();
		c.globalAlpha = Math.abs(Math.sin(60+ t/60)) * 0.3;
		c.drawImage(vignette, 0,0, 400, 200);
		c.restore();

		//cam.x = 50+Math.sin(t/100)*50


		requestAnimationFrame(update);
	}
	requestAnimationFrame(update);
});
