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
			{ name: "food", number: 102},
			{ name: "rock", number: 23}
		],
		huts: 1
	}

	for (var i=0; i<3; i++){
		possesions.villagers.push(new Villager());
	}

	var world = {
		day:0,
		weather: "rain",
		cropsMoisture : 0, //Will vary between -2 (very dry) to 2 (flooded)
		cropsEfficiency : 100
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

theme.volume = 0.1;
theme.play();

var snd = new Audio("Exchange.wav"); // buffers automatically when created

app.controller('tradeCtrl', function($scope,village){
	$scope.tradeOptions = [
		{ sell: { number: 1, name: 'villager'}, buy: { number: 300, name: 'food'}},
		{ sell: { number: 100, name: 'rock'}, buy: { name: 'sun'}},
		{ sell: { number: 100, name: 'rock'}, buy: { name: 'rain'}},
		{ sell: { number: 10, name: 'rock'}, buy: { number: 5, name: 'food'}},
		{ sell: { number: 400, name: 'food'}, buy: { number: 1, name: 'hut'}},
		{ sell: { number: 100, name: 'food'}, buy: { number: 1, name: 'villager'}}
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
				village.possesions.villagers.push(new Villager());
			}else{

				village.addMaterial(trade.buy.name,trade.buy.number);

				//village.possesions.materials.push({ name: trade.buy.name, number: trade.buy.number});
			}
		}
	};
});
