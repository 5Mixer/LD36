app.controller('gameCtrl', function($scope,village){

	$scope.$watch( function () { return village.possesions.villagers; }, function (villagers) {

		var numVillagers = villagers.length;
		var avaliableScythes = village.getMaterial("scythe").number;
		var avaliablePickaxes = village.getMaterial("pickaxe").number;


		var farmerNumber = 0;
		var minerNumber = 0;
		var idleNumber = 0;

		for (var i = 0; i < numVillagers; i++){
			if (avaliableScythes > 0){
				villagers[i].role = "farmer";
				villagers[i].roleNumber = ++farmerNumber;
				avaliableScythes--;
				continue;
			}
			if (avaliablePickaxes > 0){
				avaliablePickaxes--;
				villagers[i].role = "miner";
				villagers[i].roleNumber = ++minerNumber;
				continue;
			}
			villagers[i].role = "idle";
			villagers[i].roleNumber = ++idleNumber;
		}

	 }, true);

	var cdom = document.getElementById("canvas");
	var c = cdom.getContext("2d");

	window.addEventListener('mousemove', mouseMove, false);

	function getMousePos(evt) {
	    var rect = cdom.getBoundingClientRect();
	    return {
	      x: evt.clientX - rect.left,
	      y: evt.clientY - rect.top
	    };
	}
	function mouseMove (e){
		var pos = getMousePos(e);
		cam.x = Math.max(0,Math.min((pos.x/(cdom.width/50)),100));
		cam.y = Math.max(0,Math.min((pos.y/(cdom.height/25)),50));

	}

	cdom.setAttribute('width', Math.floor(window.getComputedStyle(cdom).width/100)*100);
	cdom.setAttribute('height', Math.floor(cdom.width/2));


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

			if ( village.possesions.villagers[i].role == "farmer"){
				if (Math.random() > (Math.abs(village.world.cropsMoisture)*.1)){

					village.addMaterial("food",1)
				}
			}
			if ( village.possesions.villagers[i].role == "miner"){
				village.addMaterial("rock",1)
			}

		}


		if (village.world.day % 3 == 0){
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


	cdom.imageSmoothingEnabled = false;
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

		for (var i=0; i < village.possesions.villagers.length; i++){
			village.possesions.villagers[i].draw(c);
		}
		for (var i=0; i < village.possesions.huts.length; i++){
			village.possesions.huts[i].draw(c);
		}


		cam.reset(c);

		c.save();
		c.globalAlpha = Math.abs(Math.sin(60+ t/60)) * 0.5;
		c.drawImage(vignette, 0,0, cdom.width, cdom.height);
		c.restore();

		// cam.x = 50+Math.sin(t/100)*50
		// cam.y = 50+Math.sin(t/50)*50


		requestAnimationFrame(update);
	}
	requestAnimationFrame(update);
});
