app = angular.module('game',[]);

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

app.factory('village', function(){

	var possesions = {
		villagers : [
			new Villager()

		],
		materials : [
			{ name: "scythe", number: 3},
			{ name: "pickaxe", number: 3},
			{ name: "food", number: 802},
			{ name: "rock", number: 23}
		],
		huts: [
            new Hut(0),
            new Hut(1)
        ]
	}

	for (var i=0; i<3; i++){
		possesions.villagers.push(new Villager());
	}

	var world = {
		day:0,
		weather: "rain",
		cropsMoisture : 0, //Will vary between -2 (very dry) to 2 (flooded)
		cropsEfficiency : 100,
        active : true
	};

	return {
		possesions : possesions,
		world : world,

		getMaterial : function(name){
			var arrayLength = possesions.materials.length;
			for (var r = 0; r < arrayLength; r++) {
				if (possesions.materials[r].name == name){

					return possesions.materials[r];
				}
			}
		},

		addMaterial : function(name,number){
			var arrayLength = possesions.materials.length;
			for (var r = 0; r < arrayLength; r++) {
				if (possesions.materials[r].name == name){

					possesions.materials[r].number += number;
				}
			}
		}

	}
});





app.controller('possessionsCtrl', function($scope,village){



	$scope.possesions = village.possesions;

	$scope.feed = function(person){


		if (village.getMaterial("food").number > (10-person.food)){
			village.addMaterial("food",-(10-person.food));
			person.food = 10;
		}else{
			if ( village.getMaterial("food").number > 0){

				person.food += village.getMaterial("food").number;
				village.getMaterial("food").number = 0;
			}
		}
	}
});

app.controller('statsCtrl', function($scope,village){
	var cropStates = [ "very dry", "dry", "perfect", "wet", "very wet"]

	$scope.$watch( function () { return village.world; }, function (world) {

		world.cropsEfficiency = 100 - (Math.abs(world.cropsMoisture) * 10);
		world.cropStatus = cropStates[world.cropsMoisture + 2]
		$scope.world = world;
	 }, true);

});

var theme = new Audio("Theme.wav"); // buffers automatically when created
theme.loop = true

theme.volume = 0.2;
theme.play();

var snd = new Audio("Exchange.wav"); // buffers automatically when created
snd.volume = 0.4;

app.controller('tradeCtrl', function($scope,village){
	$scope.tradeOptions = [
		{ sell: { number: 1, name: 'villager'}, buy: { number: 50, name: 'food'}},
		{ sell: { number: 10, name: 'rock'}, buy: { number: 5, name: 'food'}},
		{ sell: { number: 400, name: 'food'}, buy: { number: 1, name: 'hut'}},
		{ sell: { number: 20, name: 'food'}, buy: { number: 1, name: 'pickaxe'}},
		{ sell: { number: 50, name: 'rock'}, buy: { number: 1, name: 'scythe'}},
		{ sell: { number: 100, name: 'rock'}, buy: { number: 1, name: 'hut'}},
		{ sell: { number: 200, name: 'food'}, buy: { number: 1, name: 'villager'}, tooltip: function(){
            var avaliableSpot = false;
            for (i=0; i < village.possesions.huts.length; i++){
                if (village.possesions.huts[i].inhabitants.length < 3){
                    avaliableSpot = true;
                    break;
                }
            }
            if (avaliableSpot == false){
                return "A new hut must be created to house a villager.";
            }
        }}
	];


	$scope.exchange = function(trade){
		console.log(village.possesions);

        theme.pause();
        snd.play();
        snd.addEventListener('ended', function (){
            theme.play()

        });

		var possesions = village.possesions;

		var tradeAble = false;

        console.log(trade);

		if (trade.sell.name == "villager"){
			if (village.possesions.villagers.length >= trade.sell.number){
				tradeAble = true;
				for (var i=0; i < trade.sell.number; i++){
					village.possesions.villagers.splice(0,1);
				}
			}


		}else{

			var arrayLength = village.possesions.materials.length;
			for (var i = 0; i < arrayLength; i++) {
				if (village.possesions.materials[i].name == trade.sell.name){

					if (village.possesions.materials[i].number >= trade.sell.number){
						village.possesions.materials[i].number -= trade.sell.number;
						tradeAble = true;
					}
					//village.possesions.materials.splice(i,1);
					//break;
				}
			}
		}

		if (tradeAble){
			//They have sold, give them the return.
			if (trade.buy.name == "villager"){
                var avaliableSpot = false;
                for (i=0; i < village.possesions.huts.length; i++){
                    if (village.possesions.huts[i].inhabitants.length < 3){
                        avaliableSpot = true;
                        break;
                    }
                }
                if (avaliableSpot){

                    village.possesions.villagers.push(new Villager());
                }
            }else if (trade.buy.name == "hut") {
                if (village.possesions.huts.length < 6){
                    tradeAble = true;
                    village.possesions.huts.push(new Hut(village.possesions.huts.length));
                }
			}else{

				village.addMaterial(trade.buy.name,trade.buy.number);

				//village.possesions.materials.push({ name: trade.buy.name, number: trade.buy.number});
			}
		}
	};
});
