angular.module('starter.ProfilePicturesController', [])

.controller('ProfilePicturesController', function(
    $scope,
    $location,
    $ionicLoading,
    $ionicTabsDelegate,
    $ionicHistory,
    $ionicPlatform,
    $cordovaNetwork,
    CustomLoading,
    Me,
    Network
) {

    $scope.communicationError = false;

    $scope.pictureSelected = {};
    $scope.photos = [];
    $scope.disableSaveButton = true;

    /**
     * Executa a Loading e o carregamento assim que entra na tela
     */
    CustomLoading.simple('Carregando fotos...');

    Network.check()
        .then(function(result){
            Me.getFacebookProfilePictures()
                .then(function(result){
                    $scope.photos = result;
                }, function(err){
                    $scope.communicationError = true;
                })
                .finally(function(){
                    CustomLoading.hide();
                });
        }, function(err){
            $scope.communicationError = true;
        });

    $scope.selectPicture = function(photo){
        $scope.disableSaveButton = false;
        $scope.pictureSelected = photo.source;
    };

    $scope.save = function(){

        CustomLoading.simple('Salvando alteração...');

        Network.check()
            .then(function(result){
                Me.updateProfilePicture($scope.pictureSelected)
                    .then(function(data){
                        $ionicTabsDelegate.select(2);
                    }, function(data){
                        $scope.communicationError = true;
                    })
                    .finally(function(){
                        CustomLoading.hide();
                    });
            }, function(err){
                $scope.communicationError = true; 
            });
    };
});