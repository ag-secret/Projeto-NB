angular.module('starter.services', [])

// .constant('WEBSERVICE_URL', 'http://192.168.254.102:777/projeto_nb_webservice')
.constant('WEBSERVICE_URL', 'http://bbgl.kinghost.net')

.factory('Dispatcher', function($q, Me, localStorageService){
	return {
		createDataStructure: function(){
			var defer = $q.defer();
			var data = localStorageService.get('data');

			// if (!data) {
				// data = {
				// 	account: {
				// 		id: null,
				// 		username: null,
				// 		access_token: null,
				// 		profile: {
				// 			id: null,
				// 			name: null,
				// 			gender: null,
				// 			profile_image: {
				// 				small: null,
				// 				regular: null
				// 			},
				// 			account_id: null,
				// 			settings: {
				// 				prefered_age: {
				// 					min: null,
				// 					max: null
				// 				},
				// 				prefered_gender: null
				// 			}
				// 		}
				// 	}
				// };

				// localStorageService.set('data', {});
				// data = localStorageService.get('data');
			// }
			
			if (data) {
				Me.account = data.account;
			}
			
			defer.resolve(data);

			return defer.promise;
		}
	};

})
.factory('Matches', function(){
	return {
		get: function(){
			var defer = $q.defer();
			$http.put(url + '/setCurrentEvent/' + Me.profile.id, {event_id: event_id}).
			success(function(data, status, headers, config) {
				defer.resolve(data);
			}).
			error(function(data, status, headers, config) {
			});

			return defer.promise;
		},
	};
})

.factory('Events', function($http, $q, Me, WEBSERVICE_URL){

	var urlBase = WEBSERVICE_URL + '/events';

	return {
		checkImIn: function(){
			var defer = $q.defer();
			var url = urlBase + '/checkImIn/' + Me.account.id;

			$http.get(url).then(function(data){
				defer.resolve(data.data);	
			});
			
			return defer.promise;
		}
	};
})

.factory('Profiles', function(Me, $http, $q, localStorageService, WEBSERVICE_URL){
	var data = [];
	var url = WEBSERVICE_URL + '/profiles';
	return {
		setCurrentEvent: function(event_id){
			var defer = $q.defer();
			$http.put(url + '/setCurrentEvent/' + Me.account.profile.id, {event_id: event_id}).
				success(function(data, status, headers, config) {
					defer.resolve(data.data);
				}).
				error(function(data, status, headers, config) {
					defer.reject(data);
				});

			return defer.promise;
		},
		all: function(){
			return profiles;
		},
		getClose: function(current_place_id){
			
			var _this = this;
			var defer = $q.defer();

			$http.get(url + '/getCloseProfiles/' + current_place_id).
				success(function(data, status, headers, config) {
					console.log(data);
					defer.resolve(data);
				}).
				error(function(data, status, headers, config) {
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
})
// .factory('Places', function($http, $q, WEBSERVICE_URL){
// 	var data = [];
// 	var url = WEBSERVICE_URL + '/places';
// 	return {
// 		get: function(account_id){
// 			var _this = this;
// 			var profiles = $q.defer();

// 			$http.get(url + '/getCloseProfiles').
// 				success(function(data, status, headers, config) {
// 					_this.data = data.data;
// 					profiles.resolve(_this.data);
// 				}).
// 				error(function(data, status, headers, config) {
// 				});

// 			return profiles.promise;
// 		},
// 		one: function(id){
// 			var _this = this;
// 			var place = $q.defer();

// 			$http.get(url + id).
// 				success(function(data, status, headers, config) {
// 					_this.data = data.data;
// 					place.resolve(_this.data);
// 				}).
// 				error(function(data, status, headers, config) {
// 				});

// 			return place.promise;
// 		},
// 		getCurrentPlace: function(){
// 			var _this = this;
// 			var places = $q.defer();

// 			$http.get(url + '/getCurrentPlace').
// 				success(function(data, status, headers, config) {
// 					_this.data = data.data;
// 					places.resolve(_this.data);
// 				}).
// 				error(function(data, status, headers, config) {
// 				});

// 			return places.promise;
// 		},
// 	};
// })
.factory('Me', function($http, $q, localStorageService, WEBSERVICE_URL){
	var url = WEBSERVICE_URL + '/accounts';

	return {
		account: {},
		saveAndroidDeviceRegistrationId: function(regid){
			var defer = $q.defer();
			var _this = this;

			$http.put(
				WEBSERVICE_URL + '/androidPushNotification/saveDeviceRegistrationId/' + _this.account.id,
				{regid: regid}
			)
			.success(function(data, status, headers, config) {
				defer.resolve(data);
			})
			.error(function(data, status, headers, config) {
				defer.reject(data);
			});

			return defer.promise;	
		},
		updateProfilePicture: function(picture){
			var defer = $q.defer();
			var _this = this;

			$http.put(
				WEBSERVICE_URL + '/profiles/updateProfilePicture/' + _this.account.id,
				{image_url: picture}
			)
			.success(function(data, status, headers, config) {
				// console.log(data);
				defer.resolve(data);
			})
			.error(function(data, status, headers, config) {
				defer.reject(data);
			});

			return defer.promise;	
		},
		getFacebookProfilePictures: function()
		{
			var defer = $q.defer();
			var _this = this;

			$http.get(
				url + '/getFacebookProfilePictures/' + _this.account.id
			)
			.success(function(data, status, headers, config) {
				// console.log(data);
				defer.resolve(data);
			})
			.error(function(data, status, headers, config) {
				defer.reject(data);
			});

			return defer.promise;
		},
		getFacebookAccess: function(accessToken, regid)
		{
			var defer = $q.defer();
			var _this = this;

			$http.get(
				url + '/getFacebookAccess?access_token=' + accessToken + '&regid=' + regid
			)
			.success(function(data, status, headers, config) {
				var account = data.account;
				localStorageService.set('data', {account: account});
				_this.account = data;
				defer.resolve(data);

			})
			.error(function(data, status, headers, config) {
				defer.reject('Deu problema');
			});

			return defer.promise;
		},
		getAccess: function(account_id){
			
			var defer = $q.defer();
			var _this = this;

			$http.get(
				url +'/getAccess/' + account_id
			)
			.success(function(data, status, headers, config) {
				var account = data.account;
				localStorageService.set('data', {account: account});
				console.log(localStorageService.get('data'));
				_this.account = account;
				defer.resolve(data);

			})
			.error(function(data, status, headers, config) {
				defer.reject(data);
			});

			return defer.promise;
		}
	};
});
