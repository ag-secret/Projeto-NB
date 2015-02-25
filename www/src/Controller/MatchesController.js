angular.module('starter.MatchesController', [])

.controller('MatchesController', function(
    $scope,
    CustomLoading,
    Match,
    Network,
    $timeout
){
    $scope.communicationError = false;

    $scope.matches = [];

    $scope.noMoreItemsAvailable = false;
    $scope.total = null;
    $scope.page = 0;
    $scope.loadMore = function(){
        Network.check()
            .then(function(result){
                Match.all($scope.page)
                    .then(function(result){
                        var concat = $scope.matches.concat(result);
                        $scope.matches = concat;
                        $communicationError = false;
                        $scope.page++;
                        if (result.length === 0) {
                            $scope.noMoreItemsAvailable = true;
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }
                        console.log('Page: ' + $scope.page);
                    }, function(err){
                        $scope.noMoreItemsAvailable = true;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    })
                    .finally(function(){
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
            }, function(err){
                $communicationError = true;
                $scope.noMoreItemsAvailable = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    $scope.refreshMatches = function(){
        $scope.noMoreItemsAvailable = false;
        $scope.matches = [];
        $scope.page = 0;
        
        Network.check()
            .then(function(result){
                Match.all($scope.page)
                    .then(function(result){
                        $scope.noMoreItemsAvailable = false;
                        var concat = $scope.matches.concat(result);
                        $scope.matches = concat;
                        $communicationError = false;
                        $scope.page++;
                        if (result.length === 0) {
                            $scope.noMoreItemsAvailable = true;
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }
                        console.log('Page: ' + $scope.page);
                    }, function(err){
                        $scope.noMoreItemsAvailable = true;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    })
                    .finally(function(){
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
            }, function(err){
                $communicationError = true;
                $scope.noMoreItemsAvailable = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    // $scope.loadMore = function(){
    //     Network.check()
    //         .then(function(result){
    //             Match.all()
    //                 .then(function(result){
    //                     $scope.matches = result;
    //                     $communicationError = false;
    //                     $scope.testePequeno = $scope.testeGrande;
    //                 }, function(err){
    //                     $communicationError = true;
    //                 })
    //                 .finally(function(){
    //                     $scope.$broadcast('scroll.infiniteScrollComplete');
    //                     $scope.moreDataCanBeLoadedFlag = false;
    //                 });
    //         }, function(err){
    //             $communicationError = true;
    //             $scope.$broadcast('scroll.infiniteScrollComplete');
    //         });
    // };

    /**
     * Executa assim que entra na tela pegando os 'matches'
     * esta tem tem cache view então só será atualizado quando ele puxar para atualizar ou quando 
     * ele encerrar o app e abrir de novo
     */

});