angular.module('starter.model.Match', [])

.factory('Match', function(
	$http,
	$q,
	$cordovaOauth,
	$ionicPlatform,
	$cordovaPush,
	$rootScope,
	localStorageService,
	/**
	 * Constantes
	 */
	WEBSERVICE_URL
){

	return {
		matches: {},
		all: function(){

			var _this = this;
			var defer = $q.defer();

			$http.get(WEBSERVICE_URL + '/profiles/all')
				.success(function(data){
					_this.matches = data;
					localStorageService.set('matches', data);
					defer.resolve(data);
				})
				.error(function(data){
					defer.reject(data);
				});

			return defer.promise;
		},
		getOne: function(id){
			
			var _this = this;

			for (i = 0; i < _this.matches.length; i++) {
				if (_this.matches[i].id == id) {
					return _this.matches[i];
				}
			}

			return {};

		}
	};
});
