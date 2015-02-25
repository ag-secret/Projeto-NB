angular.module('starter.RateProfilesController', [])

.controller('RateProfilesController', function(
    $interval,
    $ionicLoading,
    $ionicNavBarDelegate,
    $ionicPopover,
    $ionicPopup,
    $scope,
    CustomLoading,
    Event,
    Match,
    Me,
    Network,
    Profile,
    localStorageService
){
console.log('chama');
    $scope.title = 'Buscando cocotas';
    $scope.me = Me;
    $scope.profiles = [];
    $scope.dataPopup = {};

    $scope.currentEvents = [];
    $scope.currentEvent = null;

    $scope.currentEventLeave = false;

    $scope.communicationError = false;


    $scope.currentEventExistsIn = function(currentEvent, search){
        
        var result = false;
        for (i = 0; i < search.length; i++) {
            if (search[i].id == currentEvent.id) {
                result = true;
                break;
            }
        }

        return result;
    };

    $scope.$on('$ionicView.beforeLeave', function(){
        console.log('View enter...');
    });

    // var timerRefresh = $interval(function(){
    //     console.log('Executando refresher');
    //     Event.checkImIn()
    //     .then(function(data){
    //         if ($scope.isEventLeave()) {
    //             $scope.currentEventLeave = true;
    //         }
    //         // console.log('Atualizando eventos...');
    //         if (data.length > 0) {
    //             // console.log('Eventos encontrados...');
    //             // console.log(data);
    //             $scope.currentEvents = data;
    //             if (!$scope.currentEvent) {
    //                 if (data.length == 1) {
    //                     $scope.currentEvent = data[0];
    //                 } else {
    //                     $scope.showPopup();
    //                 }
    //             }
    //         } else {
    //             $scope.currentEvents = [];
    //             $scope.currentEvent = {};
    //         }
    //         // console.log('Eventos Atualizados...');
    //     });
    // }, 3000);


    $scope.setCurrentEvent = function(currentEvent){
        Network.check()
            .then(function(result){
                Me.setCurrentEvent(currentEvent.id)
                    .then(function(result){
                        // console.log(currentEvent);
                        
                        var oldCurrentEvent = $scope.currentEvent;

                        $scope.currentEvent = currentEvent;

                        if ($scope.profiles.length > 0) {
                            if (oldCurrentEvent.id != $scope.currentEvent.id) {
                                $scope.getCloseProfiles();
                            }
                        } else {
                            $scope.getCloseProfiles();
                        }
                        
                    }, function(err){
                        $scope.communicationError = true;
                    })
                    .finally(function(){
                        CustomLoading.hide();
                    }); 
            }, function(err){
                CustomLoading.hide();
                $scope.communicationError = true;
            });
    };

    $scope.refreshEventsAndShowPopup = function(){
        CustomLoading.simple('Buscando eventos na sua localidade...');

        Network.check()
            .then(function(result){
                Event.checkImIn()
                    .then(function(result){
                        $scope.currentEvents = result;
                        $scope.showEventsPopupRefresh();
                    }, function (err) {
                        $scope.communicationError = true;
                    }).finally(function(){
                        CustomLoading.hide();
                    }); 
            }, function(err){
                $scope.communicationError = true;
                CustomLoading.hide();
            });
    };

    $scope.getEventsImIn = function(){

        CustomLoading.simple('Buscando eventos na sua localidade...');
        Network.check()
            .then(function(result){
                Event.checkImIn()
                    .then(function(result){
                        if (result.length > 0) {
                            if (result.length > 1) {
                                $scope.currentEvents = result;
                                if ($scope.currentEvent) {
                                    var oldCurrentEvent = $scope.currentEvent;

                                    if (!$scope.currentEventExistsIn(oldCurrentEvent, result)) {
                                        $scope.showEventsPopup();
                                    } else {
                                        if ($scope.profiles.length === 0) {
                                            $scope.getCloseProfiles();
                                        }
                                    }
                                } else {
                                    CustomLoading.hide();
                                    $scope.showEventsPopup();
                                }
                            } else {
                                $scope.currentEvents = result;
                                $scope.setCurrentEvent(result[0]);
                            }
                        } else {
                            $scope.currentEvents = [];
                            $scope.currentEvent = null;
                        }
                    }, function (err) {
                        $scope.communicationError = true;
                    }).finally(function(){
                        CustomLoading.hide();
                    }); 
            }, function(err){
                $scope.communicationError = true;
                CustomLoading.hide();
            });
        
    };

    // An elaborate, custom popup
    $scope.showEventsPopup = function(){
        var myPopup = $ionicPopup.show({
            templateUrl: 'src/Template/Popup/events.html',
            title: 'Aonde você está?',
            scope: $scope,
            buttons: [
                {
                    text: 'Cancelar',
                    type: 'button-assertive',
                    onTap: function(){
                        return false;
                    }
                },
                {
                    text: 'Escolher',
                    type: 'button-positive',
                    onTap: function(e) {

                        if (!$scope.dataPopup.placeSelected) {
                            e.preventDefault();
                        } else {
                            return $scope.dataPopup.placeSelected;
                        }
                    }
                }
            ]
        });

        myPopup.then(function(data) {
            // Verifica se o evento atual é o mesmo que o
            // usuario clicou, se nao ele zera os perfis

            // Seta o novo event atual
            // $scope.currentEvent = data;
            if (data) {
                $scope.setCurrentEvent(data);
            }
            // Me.setCurrentEvent($scope.currentEvent.id);
            // // Se não tiver nenhum perfil carregado, carrega novos
            // if ($scope.profiles.length === 0) {
            //     $scope.getCloseProfiles();
            // }
        });
    };

    $scope.showEventsPopupRefresh = function(){
        var myPopup = $ionicPopup.show({
            templateUrl: 'src/Template/Popup/events.html',
            title: 'Aonde você está?',
            scope: $scope,
            buttons: [
                {
                    text: 'Cancelar',
                    type: 'button-assertive',
                    onTap: function(){
                        return false;
                    }
                },
                {
                    text: 'Escolher',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.dataPopup.placeSelected) {
                            e.preventDefault();
                        } else {
                            return $scope.dataPopup.placeSelected;
                        }
                    }
                }
            ]
        });

        myPopup.then(function(data) {
            if (data) {
                $scope.setCurrentEvent(data);
            }
        });
    };

    $ionicPopover.fromTemplateUrl('src/Template/Popup/events.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.getCloseProfiles = function(){
        
        CustomLoading.simple('Buscando pessoas no seu evento...');

        Network.check()
            .then(function(result){
                Profile.getClose($scope.currentEvent.id)
                    .then(function(data){
                        if (data) {
                            $scope.profiles = data;
                            $scope.title = $scope.title = $scope.currentEvent.name;
                        }
                    }, function(err){
                        $scope.communicationError = true;
                    })
                    .finally(function(){
                        CustomLoading.hide();
                    });        
            }, function(err){
                $scope.communicationError = true;
            });
    };

    // $scope.showPopupAndRefresh = function() {
    //     if ($scope.currentEvents.length > 1) {
    //         $ionicLoading.show({template: 'Buscando a sua localidade'});
    //         Event.checkImIn()
    //             .then(function(result){
    //                 $ionicLoading.hide();
    //                 var data = result;
    //                 $scope.currentEvents = data;
    //                 if ($scope.currentEvents.length > 1) {
    //                     $scope.showPopup();
    //                 }
    //             });
    //     }
    // };

    // $scope.refreshEvents = function(tey){

    //     $ionicLoading.show({template: 'Buscando a sua localidade'});

    //     Event.checkImIn().
    //         then(function(result){
    //             var data = result;
    //             $ionicLoading.hide();
    //             $scope.currentEvents = data;
                
    //             var found = false;
    //             for (var i = 0; i < $scope.currentEvents.length; i++) {
    //                 if ($scope.currentEvents[i].id == $scope.currentEvent.id) {
    //                     found = true;
    //                 }
    //             }
    //             if ($scope.currentEvents.length > 0){
    //                 if (!found) {
    //                     if ($scope.currentEvents.length > 1) {
    //                         $scope.showPopup();
    //                     } else {
    //                         $scope.currentEvent = $scope.currentEvents[0];
    //                         Me.setCurrentEvent($scope.currentEvent.id);
    //                     }
    //                 }
    //                 $scope.getCloseProfiles();
    //             }
    //         });
    // };

    $scope.response = function(target_account_id, response){
        Network.check()
            .then(function(result){
               Match.setResponse(target_account_id, response);
            }, function(err){
                
            });

        $scope.profiles.shift();

        if ($scope.profiles.length === 0) {
            $scope.getEventsImIn();
        }
    };

    // Executa automaticamente a função para achar eventos assim que entra na view
    $scope.getEventsImIn();
});