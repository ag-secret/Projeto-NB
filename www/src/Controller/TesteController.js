angular.module('starter.TesteController', [])

.controller('TesteController', function(
    $scope,
    $ionicPopover,
    $ionicNavBarDelegate,
    $ionicLoading,
    $ionicPopup,
    $interval,
    Me
){

    $scope.me = Me.account;
    
});