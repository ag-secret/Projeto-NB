angular.module('starter.component.Common', [])


.factory('Network', function(
	$q,
	$ionicPlatform,
	$cordovaNetwork,
	PRODUCTION
){

	return {
		check: function(){

			var defer = $q.defer();

			$ionicPlatform.ready(function() {

	            var isOnline = PRODUCTION ? true : $cordovaNetwork.isOnline();

	            if (isOnline) {
	            	defer.resolve();
	            } else {
	            	defer.reject();
	            }
        	});

        	return defer.promise;
		}
	};
});
