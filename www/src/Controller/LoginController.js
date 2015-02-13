angular.module('starter.LoginController', [])
.controller('LoginController', function(
    $scope,
    $rootScope,
    $location,
    $ionicPlatform,
    $cordovaNetwork,
    $ionicTabsDelegate,
    $cordovaOauth,
    $cordovaPush,
    CustomLoading,
    localStorageService,
    Me,
    Network
) {
    
    localStorageService.clearAll();

    $scope.errorMessage = null;

    $scope.logarFacebook = function(){
        
        
        CustomLoading.simple('Entrando...');

       Network.check()
        .then(function(result){
            Me.getAccessByFacebook().then(function(result){
                $location.path('/tab/rate-profiles');
                CustomLoading.hide();
            }, function(err){
                $scope.errorMessage = err;
                CustomLoading.hide();
            });
        }, function(err){
            CustomLoading.hide();
            $scope.errorMessage = 'Conexão com a Internet não detectada';
        });
    };

    $scope.doLogin = function(account_id){
        
        CustomLoading.simple('Entrando...');

        Network.check()
            .then(function(result){
                
                Me.getAccess(account_id)
                    .then(function(result){
                        $location.path('/tab/rate-profiles');
                    }, function(err){
                        $scope.errorMessage = 'Conexão com a Internet não detectada';           
                    })
                    .finally(function(){
                        CustomLoading.hide();        
                    });

            }, function(err){
                CustomLoading.hide();
                $scope.errorMessage = 'Conexão com a Internet não detectada';   
            });
    };
});