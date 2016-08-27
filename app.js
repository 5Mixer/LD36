app = angular.module('game',[]);

app.factory('village', function(){
	return {
		possesions :{
			villagers : [
				{ name: "Steve", food: 4},
				{ name: "Bob", food: 5},
			],
			materials : [
				{ type: "rock", number: 23},
				{ type: "food", number: 73}
			]
		}
	}
});

app.controller('possessionsCtrl', function($scope,village){

	$scope.possesions = village.possesions;
});

app.controller('tradeCtrl', function($scope){
	$scope.tradeOptions = [
		{ sell: { number: 4, name: 'villager'}, buy: { number: 300, name: 'food'}},
		{ sell: { number: 100, name: 'food'}, buy: { number: 1, name: 'villager'}}
	];

	$scope.exchange = function(trade){
		console.log(trade.sell.name);

	};
});
