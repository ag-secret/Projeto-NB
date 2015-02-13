angular.module('starter.model.Event', [])

.factory('Event', function(
	$http,
	$q,
	Me,
	WEBSERVICE_URL
){

	return {
		checkImIn: function(){
			var defer = $q.defer();
			var url = WEBSERVICE_URL + '/events/checkImIn/' + Me.account.id;

			$http.get(url)
				.success(function(data){
					defer.resolve(data);	
				})
				.error(function(data){
					defer.reject();
				});
			
			return defer.promise;
		}
	};

});
