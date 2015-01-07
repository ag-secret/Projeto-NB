angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
	$scope.chats = Chats.all();
	$scope.remove = function(chat) {
		Chats.remove(chat);
	};
})

.controller('LoginController', function($scope){

})

.controller('SearchController', function($scope, $ionicPopover){

	$ionicPopover.fromTemplateUrl('templates/settings-list-popover.html', {
		scope: $scope,
	}).then(function(popover) {
		$scope.popover = popover;
	});

	$scope.openPopover = function($event) {
		$scope.popover.show($event);
	};
	$scope.closePopover = function() {
		$scope.popover.hide();
	};



})

.controller('MatchProfileController', function($scope, $stateParams, Matches){
	$scope.match = Matches.get($stateParams.matchId);
})

.controller('SearchEventsController', function($scope, Events){
	$scope.events = Events.get();
})


.controller('RateProfilesController', function($scope, $stateParams, $ionicSlideBoxDelegate, Profiles){
	$scope.profiles = Profiles.all();
	$scope.event = {name: $stateParams.eventName};

	$scope.currentSlideIndex = 0;
	$scope.slideHasChanged = function($index){
		$scope.currentSlideIndex = $index;
	};

	$scope.next = function(response) {
		var imgPlaceholder = (response) ? 'img/thumb_up.png': 'img/thumb_down.png';
		document.getElementById('slide-' + $scope.currentSlideIndex).setAttribute('src', imgPlaceholder);

		var to = $scope.currentSlideIndex + 1;
		var speed = 1200;
		console.log('to' + to);
		// $ionicSlideBoxDelegate.enableSlide(true);
    	$ionicSlideBoxDelegate.slide(to, speed);
    	// $ionicSlideBoxDelegate.enableSlide(false);
  	};
})

.controller('ChatsController', function($scope, Matches, $ionicPopover){

	$scope.matches = Matches.all();

	$ionicPopover.fromTemplateUrl('templates/settings-list-popover.html', {
		scope: $scope,
	}).then(function(popover) {
		$scope.popover = popover;
	});

	$scope.openPopover = function($event) {
		$scope.popover.show($event);
	};
	$scope.closePopover = function() {
		$scope.popover.hide();
	};
})
	.controller('ChatDetailController', function($scope, $stateParams, Matches){
		$scope.chat = Matches.get($stateParams.chatId);

		$scope.me = {account_id: 999};
	});