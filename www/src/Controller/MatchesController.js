angular.module('starter.MatchesController', [])

.controller('MatchesController', function(
    $scope,
    CustomLoading,
    Match,
    Network
){

    $scope.communicationError = false;

    $scope.matches = [];


    CustomLoading.simple('Carregando combinações...');

    Network.check(true)
        .then(function(result){
            Match.all()
                .then(function(result){
                    $scope.matches = result;
                }, function(err){
                    $communicationError = true;        
                })
                .finally(function(){
                    CustomLoading.hide();
                });
        }, function(err){
            $communicationError = true;
            CustomLoading.hide();
        });

});