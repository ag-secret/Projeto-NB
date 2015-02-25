angular.module('starter.ChatController', [])

.controller('ChatController', function(
    $scope,
    $stateParams,
    $interval,
    $ionicScrollDelegate,
    Match,
    Me,
    Network,
    CustomLoading
){

	$scope.me = Me;

	$scope.communicationError = false;

	// CustomLoading.simple('Carregando mensagens...');

    $scope.match = Match.getOne($stateParams.id);
    $scope.messages = Match.getLocalMessagesByAccount($scope.match.account_id);

    // Match.getMessages($stateParams.id);

    // $scope.refreshMessages = function(){
	   //  Network.check()
	   //  	.then(function(result){
	   //  		Match.getMessages($scope.match.account_id)
	   //  			.then(function(result){
	   //  				$ionicScrollDelegate.scrollBottom();
	   //  				$scope.messages = Match.messages;
	   //  			}, function(err){
	   //  			})
	   //  			.finally(function(){
	   //  			});
	   //  	}, function(err){
	   //  	});
    // };
    Network.check()
    	.then(function(result){
    		Match.getMessagesByAccount($scope.match.account_id)
    			.then(function(result){
					$ionicScrollDelegate.scrollBottom();
                    $scope.messages = result;
    				$scope.communicationError = false;
    			}, function(err){
    				$scope.communicationError = true;
    			})
    			.finally(function(){
    				$scope.communicationError = true;
    				CustomLoading.hide();		
    			});
    	}, function(err){
			$scope.communicationError = true;
			CustomLoading.hide();
    	});

    $scope.sendMessage = function(){
    	var message =
    		{
	    		account_id1: Me.account.id,
	    		account_id2: $scope.match.account_id,
	    		message: $scope.messageToSend,
	    		created: moment().format('YYYY-MM-DD h:mm:ss')
    		};

    	$scope.messageToSend = '';

    	Network.check()
    		.then(function(result){
    			Match.saveMessage(message)	
    				.then(function(result){

                    Network.check()
                            .then(function(result){
                                Match.getMessagesByAccount($scope.match.account_id)
                                    .then(function(result){
                                        $ionicScrollDelegate.scrollBottom();
                                        $scope.messages = result;
                                        $scope.communicationError = false;
                                    }, function(err){
                                        $scope.communicationError = true;
                                    })
                                    .finally(function(){
                                        $scope.communicationError = true;
                                        CustomLoading.hide();       
                                    });
                            }, function(err){
                                $scope.communicationError = true;
                                CustomLoading.hide();
                            });

    					$scope.communicationError = false;
    				}, function(err){
    					$scope.communicationError = true;
    				})
    				.finally(function(){
    				});
    		}, function(err){
    			$scope.communicationError = true;
    		});
    };

});