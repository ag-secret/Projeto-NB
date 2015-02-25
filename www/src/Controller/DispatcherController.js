angular.module('starter.DispatcherController', [])

.controller('DispatcherController', function(
    /**
     * Injections
     */
    $cordovaPush,
    $ionicTabsDelegate,
    $location,
    $state,
    $scope,
    $ionicPlatform,
    $window,
    PUSH_NOTIFICATION_SENDER_ID,
    /**
     * Components
     */
    localStorageService,
    CustomLoading,
    /**
     * Models
     */
    Match,
    Me
){

    CustomLoading.simple('Dispatcher Aguarde...');

    Me.account = localStorageService.get('account');
    // Match.matches = localStorageService.get('matches');

    if (Me.account) {
        CustomLoading.hide();
        $state.go('tab.matches');
    } else {
        $state.go('login');    
    }

    return true;

    $ionicPlatform.ready(function() {
        alert('plat ready');
        var androidConfig = {
            "senderID": PUSH_NOTIFICATION_SENDER_ID,
        };

        $cordovaPush.register(androidConfig).then(function(result) {
        // Success
            Me.account = localStorageService.get('account');

            if (Me.account) {
                $state.go('tab.rate-profiles');
            } else {
                $state.go('login');    
            }
            
        }, function(err) {
        // Error
            alert('Tente novamente');
            CustomLoading.hide();
        });
    });
    // Me.account = localStorageService.get('account');
    // Match.matches = localStorageService.get('matches');
    // Match.messages = localStorageService.get('messages');

    /**
     * Verifica se possuem dados, caso sim ele direciona para a tela de eventos
     * caso contrário ele limpa todos os dados do cache (para evitar que fique algum vestígio) e direciona para tela de login
     */
    // if (1 == 2/*Me.account*/) {
    //     // $location.path('/tab/rate-profiles');
    //     $state.go('tab.rate-profiles');
    // } else {
    //     // localStorageService.clearAll();
    //     CustomLoading.hide();
    //    $state.go('login');
    // }

});