angular.module('starter.model.Profile', [])

.factory('Profile', function(
	$http,
	$q,
	Me,
	localStorageService,
	WEBSERVICE_URL
){
	var data = [];

	return {

		all: function(){
			return profiles;
		},

		getClose: function(event_id){
			
			var _this = this;
			var defer = $q.defer();

			$http.get(WEBSERVICE_URL + '/profiles/getCloseProfiles?id=' + Me.account.id + '&event_id=' + event_id).
				success(function(data, status, headers, config) {
					defer.resolve(data);
				}).
				error(function(data, status, headers, config) {
					defer.reject(data);
				});

			return defer.promise;
		},
		setLocation: function(params){
			var _this = this;
			var prom = $q.defer();

			$http.post(url + '/setLocation', params).
			success(function(data, status, headers, config) {
				//_this.data = data.message;
				prom.resolve(data);
			}).
			error(function(data, status, headers, config) {
			});

			return prom.promise;	
		},
		getLocation: function(id){
			var _this = this;
			var prom = $q.defer();

			$http.get(url + '/getLocation/' + id).
			success(function(data, status, headers, config) {
				prom.resolve(data.data);
			}).
			error(function(data, status, headers, config) {
			});

			return prom.promise;	
		},
		setPreferedGender: function(gender){
			
			var _this = this;
			var defer = $q.defer();

			$http.post(
				url + '/setPreferedGender/' + Me.account.id,
				{gender: gender}
			)
			.success(function(data, status, headers, config) {
				Me.account.profile.settings.prefered_gender = gender;
				localStorageService.set('data', {account: Me.account});
				defer.resolve(data.data);
			})
			.error(function(data, status, headers, config) {
				defer.reject(data);
			});

			return defer.promise;
		},

		setPreferedAge: function(min, max){
			
			var _this = this;
			var derer = $q.defer();

			$http.post(
				url + '/setPreferedAge/' + Me.account.id,
				{
					min: min,
					max: max
				}
			)
			.success(function(data, status, headers, config) {
				Me.account.profile.settings.prefered_age.min = min;
				Me.account.profile.settings.prefered_age.max = max;
				localStorageService.set('data', {account: Me.account});
				derer.resolve(data.data);
			})
			.error(function(data, status, headers, config) {
				derer.reject(data);
			});

			return derer.promise;
		}

	};
});
