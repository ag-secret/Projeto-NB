angular.module('starter.SettingsController', [])

.controller('SettingsController', function(
    $scope,
    CustomLoading,
    $ionicPopup,
    $ionicActionSheet,
    $timeout,
    $ionicPlatform,
    $cordovaNetwork,
    Me,
    Profile
){
    
    /**
     * Informações de Conta logada
     * @type {Object}
     */
    $scope.me = Me;

    $scope.communicationError = false;

    $scope.showPreferedGenderPopup = function() {
        $scope.datapopup= {};
        $scope.datapopup.gender = $scope.me.account.profile.settings.prefered_gender;

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            templateUrl: 'src/Template/Popup/prefered-gender.html',
            title: 'Selecione o genêro',
            scope: $scope,
            buttons: [
                {
                    text: 'Cancelar',
                    onTap: function(e) {
                        return false;
                    }
                },
                {
                    text: '<b>Salvar</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        return $scope.datapopup.gender;
                    }
                }
            ]
        });

        myPopup.then(function(res) {
            if (res) {
                CustomLoading.simple('Salvando alterações...');

                Network.check()
                    .then(function(result){
                        Me.setPreferedGender(res)
                            .then(function(result){
                                // ...
                            }, function(err){
                                $scope.communicationError = true;
                            })
                            .finally(function(){
                                CustomLoading.hide();
                            });
                    }, function(err){
                        $scope.communicationError = false;
                    });
            }
        });

    };

    $scope.showPreferedAgePopup = function() {
        $scope.popupdata= {};
        $scope.popupdata.age = {min: $scope.me.account.profile.settings.prefered_age.min, max: $scope.me.account.profile.settings.prefered_age.max};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            templateUrl: 'src/Template/Popup/prefered-age.html',
            title: 'Selecione o range de idade',
            scope: $scope,
            buttons: [
                {
                    text: 'Cancelar',
                    onTap: function(e) {
                        return false;
                    }
                },
                {
                    text: '<b>Salvar</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        return $scope.popupdata;
                    }
                }
            ]
        });

        myPopup.then(function(res) {
            if (res) {
                
                CustomLoading.simple('Salvando alterações...');

                $ionicPlatform.ready(function() {

                    $scope.communicationError = !$cordovaNetwork.isOnline();

                    if (!$scope.communicationError) {
                        Me.setPreferedAge(res.age.min, res.age.max)
                            .then(function(result){
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
            }
        });

    };

    $scope.rangeControl = function(el){
        var min = 19;
        var max = 59;
        if ($scope.popupdata.age.min >= max) {
            $scope.popupdata.age.min = max;
        }
        if ($scope.popupdata.age.max <= min) {
            $scope.popupdata.age.max = min;
        }
        if (el == 'min') {
            if ($scope.popupdata.age.min >= $scope.popupdata.age.max) {
              $scope.popupdata.age.max = parseInt($scope.popupdata.age.min) + 1;
            }    
        } else {
            if ($scope.popupdata.age.max <= $scope.popupdata.age.min) {
                $scope.popupdata.age.min = parseInt($scope.popupdata.age.max) - 1;
            }
        }
    };

    // An alert dialog
    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'OPS!',
            template: 'Você deve selecionar ao menos um sexo.',
            onTap: function(){
                console.log('sd');
            }
        });
        alertPopup.then(function(res) {
            if ($scope.me.gender == 'm') {
                $scope.gender.f = true;
            } else {
                $scope.gender.m = true;
            }
        });
    };

});