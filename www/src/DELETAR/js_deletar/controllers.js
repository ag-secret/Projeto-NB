angular.module('starter.controllers', [])

.controller('AppController', function($scope, Me) {
    $scope.$on('$ionicView.enter', function(e) {
    });
})

.controller('TesteDistanciaController', function(
    $scope,
    $ionicLoading,
    $ionicPlatform,
    $ionicPopup,
    $cordovaGeolocation,
    $cordovaPush,
    $cordovaFileTransfer,
    $rootScope,
    $http,
    Me,
    Profiles,
    localStorageService
){


    $ionicLoading.show({template: 'Aguarde...'});
    
    $scope.downloadProgress = 'Aguarde';

    $ionicPlatform.ready(function() {
        $ionicLoading.hide();
        var url = "https://xtrasaltandvinegar.files.wordpress.com/2011/08/katy_perry_boobs_pvc.jpg";
        var targetPath = "/testImage.png";
        var trustHosts = true;
        var options = {};

        $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
            .then(function(result) {
                // Success!
            }, function(err) {
                // Error
                $scope.downloadProgress = err;
            }, function (progress) {
                $timeout(function () {
                    $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                });
            });
    });

    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1); 
        var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        var d = d * 1000;
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    $scope.me = Me.account;

    $scope.lat = 'indefinido';
    $scope.lng = 'indefinido';
    $scope.accuracy = 'indefinido';

    return false;

    //O Usuario em relação a vc
    $scope.user_param = {};
    $scope.user_param.id = $scope.me.id == 1 ? 2 : 1;

    $scope.showAlert = function(text) {
        var alertPopup = $ionicPopup.alert({
            title: 'OPS!',
            template: text,
            onTap: function(){
            }
        });
        alertPopup.then(function(res) {
        });
    };

    $scope.getDistanceBetween = function(){
        $ionicLoading.show({template: 'Calculando...'});
        Profiles.getLocation($scope.me.id).then(function(data){
            $scope.me.lat = data.lat;
            $scope.me.lng = data.lng;
            console.log($scope.me);
            Profiles.getLocation($scope.user_param.id).then(function(data){
                $scope.user_param.lat = data.lat;
                $scope.user_param.lng = data.lng;
                var distance = getDistanceFromLatLonInKm($scope.lat, $scope.lng, $scope.user_param.lat, $scope.user_param.lng);
                $ionicLoading.hide();
                $scope.showAlert('Distancia: ' + distance);
            });
        });
    };

    $scope.getPosition = function(){
        $ionicLoading.show({template: 'Obtendo localização'});
        $ionicPlatform.ready(function() {
            var posOptions = {timeout: 10000, enableHighAccuracy: true};
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    console.log(position);
                    $scope.lat  = position.coords.latitude;
                    $scope.lng = position.coords.longitude;
                    $scope.accuracy = position.coords.accuracy;

                    Profiles.setLocation({id: $scope.me.id, lat: $scope.lat, lng: $scope.lng}).then(function(data){
                        console.log(data);
                    });

                    $ionicLoading.hide();
                }, function(err) {
                    $ionicLoading.hide();
                    $scope.showAlert('Não foi possivel pegar a sua localidade pois o GPS está desativado.');
                });
        });
    };

    $ionicLoading.show({template: 'Obtendo localização'});
    $scope.getPosition();
})

.controller('MySettingsController', function(
    $scope,
    $ionicLoading,
    $ionicPopup,
    $ionicActionSheet,
    $timeout,
    Me,
    Profiles
){
    
    
    $scope.me = Me;

    $scope.teste = function(){
        Me.account.username = 'tey';
    };

    $scope.showPreferedGenderPopup = function() {
        $scope.datapopup= {};
        $scope.datapopup.gender = $scope.me.account.profile.settings.prefered_gender;

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            templateUrl: 'templates/prefered-gender-settings.html',
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
                $ionicLoading.show({template: 'Salvando alterações, aguarde...'});
                Profiles.setPreferedGender(res).
                    then(function(){
                        $ionicLoading.hide();
                    });
                return true;
            }
        });

    };

    $scope.showPreferedAgePopup = function() {
        $scope.popupdata= {};
        $scope.popupdata.age = {min: $scope.me.account.profile.settings.prefered_age.min, max: $scope.me.account.profile.settings.prefered_age.max};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            templateUrl: 'templates/age-settings-popup.html',
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
                $ionicLoading.show({template: 'Salvando dados, Aguarde...'});

                Profiles.setPreferedAge(res.age.min, res.age.max)
                .then(function(){
                    $ionicLoading.hide();
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

})

.controller('ProfilePicturesController', function(
    $scope,
    $location,
    $ionicLoading,
    $ionicTabsDelegate,
    $ionicHistory,
    Me
) {

    $scope.pictureSelected = {};
    $scope.photos = [];
    $scope.disableSaveButton = true;

    $scope.selectPicture = function(photo){
        $scope.disableSaveButton = false;
        $scope.pictureSelected = photo.source;
    };

    $scope.save = function(){
        $ionicLoading.show({template: 'Salvando foto, aguarde...'});
        Me.updateProfilePicture($scope.pictureSelected).then(function(data){
            $ionicLoading.hide();
            $ionicTabsDelegate.select(2);
        }, function(data){
            $ionicLoading.hide();
        });
    };

    $ionicLoading.show({template: 'Carregando fotos, aguarde...'});

    Me.getFacebookProfilePictures().then(function(data){
        $scope.photos = data;
        $ionicLoading.hide();
    });
})
.controller('DispatcherController', function(
    $scope,
    $ionicLoading,
    $location,
    $ionicTabsDelegate,
    localStorageService,
    Me,
    Dispatcher
){

    $ionicLoading.show({template: 'Aguarde...'});
    Dispatcher.createDataStructure().then(function(data){
        $ionicLoading.hide();
        if (data) {
            $location.url('/tab/search');
        } else {
            $location.url('/login');
        }
    });
})
.controller('LogoutController', function($location, $ionicPlatform, localStorageService) {
    $location.url('/login');
})

.controller('LoginController', function(
    $scope,
    $rootScope,
    $ionicPlatform,
    $location,
    $ionicLoading,
    $ionicTabsDelegate,
    $cordovaOauth,
    $cordovaPush,
    localStorageService,
    Me
) {
    
    localStorageService.clearAll();

    $scope.facebookResult = {};

    $scope.flashMessage = null;

    $scope.logarFacebook = function(){
        $ionicLoading.show({template: 'Obtendo acesso, aguarde...'});
        
        $ionicPlatform.ready(function() {
            var facebookAppId = 401554549993450;
            var scope = "email, user_birthday, user_photos";

            $cordovaOauth.facebook(facebookAppId, [scope]).then(function(result) {
                var facebook_access_token = result.access_token;
                var androidConfig = {
                    "senderID": "552977488644",
                };

                $cordovaPush.register(androidConfig).then(function(result) {
                    // Success
                    alert('Registrou joia');
                }, function(err) {
                    // Error
                    $scope.flashMessage = 'Deu ruim para registrar o push message';
                });

                $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
                    switch(notification.event) {
                        case 'registered':
                            alert('no case registrado mas ainda nao com regid');
                            if (notification.regid.length > 0 ) {
                                alert('no case registrado mas ainda e JÁ com regid');
                                Me.getFacebookAccess(facebook_access_token, notification.regid)
                                    .then(function(data){
                                        alert('Joia facebook aget access');
                                        $ionicLoading.hide();
                                        $location.url('/tab/search');
                                    }, function(data){
                                        alert('Erro facebook get access');
                                        $scope.flashMessage = data;
                                        $ionicLoading.hide();
                                    });
                            }
                        break;
                    }
                });
                
                
            }, function(error) {
                $ionicLoading.hide();
                $scope.flashMessage = 'Ocorreu um erro ao tentar logar';
            });
        });
    };

    $scope.doLogin = function(account_id){
        $ionicLoading.show({template: 'Obtendo acesso, aguarde...'});
        Me.getAccess(account_id).then(function(data){
            $location.url('/tab/search');
            $ionicLoading.hide();
        }, function(data){
            $scope.flashMessage = data;
            $ionicLoading.hide();
        }); 
    };
})

.controller('SearchController', function(
    $scope,
    $ionicPopover,
    $ionicNavBarDelegate,
    $ionicLoading,
    $ionicPopup,
    $interval,
    Me,
    Profiles,
    Events
){

    $scope.title = 'Buscando cocotas';
    $scope.me = Me;
    $scope.profiles = [];
    $scope.dataPopup = {};

    $scope.currentEvents = [];
    $scope.currentEvent = {};

    $scope.currentEventLeave = false;


    $scope.isEventLeave = function(){
        
        var result = true;
        for (i = 0; i < $scope.currentEvents.length; i++) {
            console.log($scope.currentEvents[i] == $scope.currentEvent);
            if ($scope.currentEvents[i] == $scope.CurrentEvent) {
                result = false;
                break;
            }
        }

        return result;
    };

    var timerRefresh = $interval(function(){
        Events.checkImIn()
        .then(function(data){
            console.log($scope.isEventLeave());
            if ($scope.isEventLeave()) {
                // $scope.currentEventLeave = true;
            }
            console.log('Atualizando eventos...');
            if (data.length > 0) {
                console.log('Eventos encontrados...');
                console.log(data);
                $scope.currentEvents = data;
                if (!$scope.currentEvent) {
                    if (data.length == 1) {
                        $scope.currentEvent = data[0];
                    } else {
                        $scope.showPopup();
                    }
                }
            } else {
                $scope.currentEvents = [];
                $scope.currentEvent = {};
            }
            console.log('Eventos Atualizados...');
        });
    }, 3000);

    $scope.getEventsImIn = function(){

        $ionicLoading.show({template: 'Buscando eventos na sua localidade, aguarde...'});

        Events.checkImIn()
            .then(function(data){
                if (data.length > 0) {
                    $scope.currentEvents = data;
                    if ($scope.currentEvents.length > 1) {
                        $scope.showPopup();
                    } else {
                        $scope.currentEvent = data[0];
                        Profiles.setCurrentEvent($scope.currentEvent.id)
                        .then(function(){
                            $scope.getCloseProfiles();    
                        });
                        
                    }
                } else {
                    $scope.currentEvents = [];
                    $scope.currentEvent = {};
                }
                $ionicLoading.hide();
            });
    };

    // An elaborate, custom popup
    $scope.showPopup = function(){
        var myPopup = $ionicPopup.show({
            templateUrl: 'templates/places-popup.html',
            title: 'Aonde você está?',
            scope: $scope,
            buttons: [
                {
                    text: '<b>Aqui!</b>',
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
            if ($scope.currentEvent.id != data.id) {
                $scope.profiles = [];
            }
            // Seta o novo event atual
            $scope.currentEvent = data;
            Profiles.setCurrentEvent($scope.currentEvent.id);
            // Se não tiver nenhum perfil carregado, carrega novos
            if ($scope.profiles.length === 0) {
                $scope.getCloseProfiles();
            }
        });
    };

    $ionicPopover.fromTemplateUrl('templates/settings-list-popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.getCloseProfiles = function(){
        $ionicLoading.hide();
        $ionicLoading.show({template: 'Buscando pessoas no seu evento, aguarde...'});
      
        Profiles.getClose($scope.currentEvent.id)
            .then(function(data){
                if (data) {
                    $scope.profiles = data;
                    $scope.title = $scope.title = $scope.currentEvent.name;
                }
                $ionicLoading.hide();
            });
    };

    $scope.showPopupAndRefresh = function() {
        if ($scope.currentEvents.length > 1) {
            $ionicLoading.show({template: 'Buscando a sua localidade'});
            Events.checkImIn()
                .then(function(result){
                    $ionicLoading.hide();
                    var data = result;
                    $scope.currentEvents = data;
                    if ($scope.currentEvents.length > 1) {
                        $scope.showPopup();
                    }
                });
        }
    };

    $scope.refreshEvents = function(tey){

        $ionicLoading.show({template: 'Buscando a sua localidade'});

        Events.checkImIn().
            then(function(result){
                var data = result;
                $ionicLoading.hide();
                $scope.currentEvents = data;
                
                var found = false;
                for (var i = 0; i < $scope.currentEvents.length; i++) {
                    if ($scope.currentEvents[i].id == $scope.currentEvent.id) {
                        found = true;
                    }
                }
                if ($scope.currentEvents.length > 0){
                    if (!found) {
                        if ($scope.currentEvents.length > 1) {
                            $scope.showPopup();
                        } else {
                            $scope.currentEvent = $scope.currentEvents[0];
                            Profiles.setCurrentEvent($scope.currentEvent.id);
                        }
                    }
                    $scope.getCloseProfiles();
                }
            });
    };

    $scope.response = function(){
        $scope.profiles.shift();
        if ($scope.profiles.length === 0) {
            $scope.refreshEvents();
        }
    };

    // Executa automaticamente a função para achar eventos assim que entra na view
    $scope.getEventsImIn();
})

.controller('MatchProfileController', function($scope, $stateParams, Matches){
    $scope.match = Matches.get($stateParams.matchId);
})

.controller('RateProfilesController', function($scope, $stateParams, $ionicTabsDelegate, $ionicSlideBoxDelegate, $location, $ionicHistory, Profiles){
})

.controller('ChatsController', function($scope, Matches, $ionicPopover, Me){

    $scope.me = Me;

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
.controller('ChatDetailController', function(
    $scope,
    $stateParams,
    $firebase,
    Matches
){
    $scope.chat = Matches.get($stateParams.chatId);

    // $scope.me = {account_id: 999};

    // var ref = new Firebase("https://projeto-nb.firebaseio.com/messages");
    // var sync = $firebase(ref);
    // $scope.messages = sync.$asArray();

    // $scope.sendMessage = function(){
    //     var message = {account_id: $scope.me.account_id, message: $scope.messageToSend};
    //     $scope.messages.$add(message);
    //     console.log(message);
    // };

});