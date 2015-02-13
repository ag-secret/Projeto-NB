angular.module('starter.ChatController', [])

.controller('ChatController', function(
    $scope,
    $stateParams,
    Match
){

	console.log(Match.getOne($stateParams.id));

    $scope.match = Match.getOne($stateParams.id);
    $scope.messages = [];

});