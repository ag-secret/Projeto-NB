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
    Me
) {

    $scope.communicationError = false;

    $scope.pictureSelected = {};
    $scope.photos = [];
    $scope.disableSaveButton = true;

    /**
     * Executa a Loading e o carregamento assim que entra na tela
     */
    CustomLoading.simple('Carregando fotos...');

    $ionicPlatform.ready(function() {

        $scope.communicationError = $cordovaNetwork.isOnline() ? false : true;
        
        if (!$scope.communicationError) {
            Me.getFacebookProfilePictures()
                .then(function(result){
                    $scope.photos = result;
                }, function(err){
                    $scope.communicationError = true;
                })
                .finally(function(){
                    CustomLoading.hide();
                });
        } else {
            CustomLoading.hide();
        }
    });

    $scope.selectPicture = function(photo){
        $scope.disableSaveButton = false;
        $scope.pictureSelected = photo.source;
    };

    $scope.save = function(){

        $ionicPlatform.ready(function() {

            $scope.communicationError = $cordovaNetwork.isOnline() ? false : true;
            
            if (!$scope.communicationError) {
                
                CustomLoading.simple('Salvando alteração...');

                Me.updateProfilePicture($scope.pictureSelected)
                    .then(function(data){
                        CustomLoading.hide();
                        $ionicTabsDelegate.select(2);
                    }, function(data){
                        $scope.communicationError = true;
                    })
                    .finally(function(){
                        CustomLoading.hide();
                    });
            } else {
                CustomLoading.hide();
            }
        });
    };
});