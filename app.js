app = angular.module('game',[]);

app.factory('village', function(){

	var possesions = {
		villagers : [
			{ name: "Bob", food: Math.round(Math.random()*4)+6},
			{ name: "Jeremy", food: Math.round(Math.random()*4)+6},
			{ name: "Alice", food: Math.round(Math.random()*4)+6},
			{ name: "Steve", food: Math.round(Math.random()*4)+6},
			{ name: "Robin", food: Math.round(Math.random()*4)+6},
		],
		materials : [
			{ name: "scythe", number: 3},
			{ name: "pickaxe", number: 3},
			{ name: "food", number: 173},
			{ name: "rock", number: 23}
		]
	}

	var world = {
		day:0,
		weather: "rain"
	};

	return {
		possesions : possesions,
		world : world,

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
});
app.controller('statsCtrl', function($scope,village){

	$scope.$watch( function () { return village.world; }, function (world) {
		$scope.world = world;
	 }, true);

});



app.controller('tradeCtrl', function($scope,village){
	$scope.tradeOptions = [
		{ sell: { number: 4, name: 'villager'}, buy: { number: 300, name: 'food'}},
		{ sell: { number: 10, name: 'rock'}, buy: { number: 5, name: 'food'}},
		{ sell: { number: 400, name: 'food'}, buy: { number: 1, name: 'hut'}},
		{ sell: { number: 100, name: 'food'}, buy: { number: 1, name: 'villager'}}
	];

	$scope.exchange = function(trade){
		console.log(village.possesions);

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
				village.possesions.villagers.push({ name: "Untitled", food: 10});
			}else{

				village.addMaterial(trade.buy.name,trade.buy.number);

				//village.possesions.materials.push({ name: trade.buy.name, number: trade.buy.number});
			}
		}
	};
});
