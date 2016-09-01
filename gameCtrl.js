app.controller('gameCtrl', function($scope,village){


	function allocateHuts (){
		var numHuts = village.possesions.huts.length;
		//Clear all huts.
		for (var i=0; i < numHuts; i++){
			village.possesions.huts[i].inhabitants = [];
		}
		//For every villagers
		for (var v = 0; v < village.possesions.villagers.length; v++){
			//Loop through the huts
			for (var i=0; i < numHuts; i++){
				//If the hut isn't full, put player in it.
				if (village.possesions.huts[i].inhabitants.length < village.possesions.huts[i].maxSize){
					village.possesions.villagers[v].hut = village.possesions.huts[i];
					village.possesions.huts[i].inhabitants.push(village.possesions.villagers[v]);
					break;
				}
			}
		}
	}

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

	$scope.$watch( function () { return [village.possesions.huts.length,village.possesions.villagers.length]; }, function (huts) {

 	//	allocateHuts();

 	 }, true);

	var cdom = document.getElementById("canvas");
	var c = cdom.getContext("2d");

	window.addEventListener('mousemove', mouseMove, false);
	window.addEventListener('touchmove', mouseMove, false);

	function getMousePos(evt) {
	    var rect = cdom.getBoundingClientRect();

		var x = evt.clientX - rect.left
		var y = evt.clientY - rect.top


		if (x < 0 || x > window.getComputedStyle(cdom).width.slice(0,-2) || y < 0 || y > window.getComputedStyle(cdom).height.slice(0,-2)){
			x = 200;
			y = 50;
		}
	    return {
	      x: x,
	      y: y
	    };
	}
	function mouseMove (e){
		var pos = getMousePos(e);
		cam.targetx = Math.floor(Math.max(0,Math.min((pos.x/(cdom.width/50)),100)));
		cam.targety = Math.floor(Math.max(0,Math.min((pos.y/(cdom.height/25)),50)));

	}

	cdom.setAttribute('width', Math.floor(window.getComputedStyle(cdom).width/100)*100);
	cdom.setAttribute('height', Math.floor(cdom.width/2));

	width = cdom.width;
	height = cdom.height;

	$scope.gameActive = village.world.active;

	var tick = function(){

		if (village.world.active == false){
			return;
		}

		if (village.possesions.villagers.length < 1){
			$scope.gameActive = false;
			village.world.active = false;
		}

		village.world.day++;
		village.world.weather = Math.random() > 0.4 ? "sun" : "rain";

		if (village.world.weather == "sun" && village.world.cropsMoisture > -2){
			village.world.cropsMoisture--;
			rain.enabled = false;
		}
		if (village.world.weather == "rain" && village.world.cropsMoisture < 2){
			village.world.cropsMoisture++;
			rain.enabled = true;
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
	img.src = "assets/Land.png";


	var vignette = new Image();
	vignette.src = "assets/Vignette.png";


	cdom.imageSmoothingEnabled = false;
	c.mozImageSmoothingEnabled = false;
	c.webkitImageSmoothingEnabled = false;
	c.msImageSmoothingEnabled = false;
	c.imageSmoothingEnabled = false;

	var rain = new Rain();
	rain.enabled = true;


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
		rain.draw(c);

		c.save();
		c.globalAlpha = Math.abs(Math.sin(60+ t/60)) * 0.3;
		c.drawImage(vignette, 0,0, cdom.width, cdom.height);
		c.restore();

		// cam.x = 50+Math.sin(t/100)*50
		// cam.y = 50+Math.sin(t/50)*50


		requestAnimationFrame(update);
	}
	requestAnimationFrame(update);
});
