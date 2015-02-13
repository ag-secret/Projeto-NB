angular.module('starter.MatchProfileController', [])

.controller('MatchProfileController', function(
    $scope,
    $stateParams,
    Match
){
    console.log($stateParams.id);
    
    $scope.match = Match.getOne($stateParams.id);

});