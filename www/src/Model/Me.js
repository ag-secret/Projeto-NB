angular.module('starter.model.Me', [])

.factory('Me', function(
	$cordovaOauth,
	$cordovaPush,
	$http,
	$ionicPlatform,
	$q,
	$rootScope,
	localStorageService,
	/**
	 * Constantes
	 */
	FACEBOOK_APP_ID,
	PUSH_NOTIFICATION_SENDER_ID,
	WEBSERVICE_URL
){

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
			console.log(picture);
			$http.put(
				WEBSERVICE_URL + '/profiles/updateProfilePicture/' + _this.account.id,
				{image_url: picture}
			)
			.success(function(data, status, headers, config) {
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
				WEBSERVICE_URL + '/accounts/getFacebookProfilePictures/' + _this.account.id
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

		getAccountByFacebookAccesToken: function(accessToken, pushRegid){
			alert('Entou no getfacebook by access token');
			alert(accessToken);
			alert(pushRegid);
			alert(ionic.Platform.platform());
			var defer = $q.defer();

			var url = WEBSERVICE_URL + '/accounts/getAccountByFacebook';
			alert('Começar o request agora');
			$http.post(
				url,
				{
					accessToken: accessToken,
					pushRegid: pushRegid,
					platform: ionic.Platform.platform()
				}
			)
				.success(function(data, status){
					alert('Boa');
					defer.resolve(data);
				})
				.error(function(data){
					alert('Ruim');
					defer.reject(data);
				});

			return defer.promise;
		},



		getAccessByFacebook: function(){
			
			var _this = this;
			var defer = $q.defer();

			_this.getFacebookAccessToken()
				.then(function(result){
					alert('Retornou da api e vai char o getPushRegid');
					var facebookAccessToken = result;

					_this.getPushRegid()
						.then(function(result){
							var pushRegid = result;

							_this.getAccountByFacebookAccesToken(facebookAccessToken, pushRegid)
								.then(function(data, status){
									alert('Voltou');
									_this.account = data.account;
									alert(JSON.stringify(data));
									localStorageService.set('account', data.account);
									defer.resolve(true);
								}, function(err){
									defer.reject(err);
								});
						}, function(err){
							defer.reject(err);
						});
				}, function(err){
					defer.reject(err);
				});

			return defer.promise;
		},
		getPushRegid: function(){
			var defer = $q.defer();

		    var androidConfig = {senderID: PUSH_NOTIFICATION_SENDER_ID};
		    alert('Antes de entrar em platform ready');
			$ionicPlatform.ready(function() {
				alert('Etrou');
	            $cordovaPush.register(androidConfig).then(function(result) {
	                // Success
	                alert('Registrou agora acho que nao vai entrar no registered');
	            }, function(err) {
	                // Error
	                defer.reject('Erro ao registrar Push Notification');
	            });

	            $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
	                switch(notification.event) {
	                    case 'registered':
	                    alert('entrou hahah' + notification.regid);
	                        if (notification.regid.length > 0 ) {
	                            defer.resolve(notification.regid);
	                        } else {
	                        	defer.reject('Erro ao obter regid');
	                        }
	                    break;
	                }
	            });
        	});

			return defer.promise;

		},
		getFacebookAccessToken: function()
		{
			var _this = this;
			var scope = 'email,user_birthday,user_photos';

			var defer = $q.defer();
			alert('Estrou na função mas nao vai entrar no platform ready eu acho');
			$ionicPlatform.ready(function() {
				alert('Etrou no platform ready');
	            $cordovaOauth.facebook(FACEBOOK_APP_ID, [scope]).then(function(result) {
	            	alert('Voltou do facebook api');
	                defer.resolve(result.access_token);
	                
	            /**
	             * Erro ao pegar o accesstoken do Facebook
	             * @param  {string} err 	Descrição do erro
	             * @return {string}			Descrição do erro
	             */
	            }, function(err) {
	                defer.reject(err);
	            });
			});

			return defer.promise;
		},
		getAccess: function(account_id){
			
			var defer = $q.defer();
			var _this = this;

			$http.get(
				WEBSERVICE_URL + '/accounts/getAccess/' + account_id
			)
			.success(function(data, status, headers, config) {
				var account = data.account;
				localStorageService.set('account', account);
				_this.account = account;
				defer.resolve(data.account);

			})
			.error(function(data, status, headers, config) {
				defer.reject('Erro ao tentar obter acesso');
			});

			return defer.promise;
		},

		setPreferedGender: function(gender){
			
			var _this = this;
			var defer = $q.defer();

			$http.post(
				WEBSERVICE_URL + '/profiles/setPreferedGender?id=' + _this.account.id,
				{gender: gender}
			)
				.success(function(data, status, headers, config) {
					_this.account.profile.settings.prefered_gender = gender;
					localStorageService.set('account', _this.account);
					
					defer.resolve(data);
				})
				.error(function(data, status, headers, config) {
					defer.reject(data);
				});

			return defer.promise;
		},

		setPreferedAge: function(min, max){
			
			var _this = this;
			var defer = $q.defer();

			$http.post(
				WEBSERVICE_URL + '/profiles/setPreferedAge?id=' + _this.account.id,
				{
					min: min,
					max: max
				}
			)
			.success(function(data, status, headers, config) {
				_this.account.profile.settings.prefered_age.min = min;
				_this.account.profile.settings.prefered_age.max = max;
				localStorageService.set('account', _this.account);

				defer.resolve(data);
			})
			.error(function(data, status, headers, config) {
				defer.reject(data);
			});

			return defer.promise;

		},

		setCurrentEvent: function(event_id){
			var _this = this;
			var defer = $q.defer();

			var path = WEBSERVICE_URL + '/profiles/setCurrentEvent?id=' + _this.account.id;
			
			$http.put(path, {event_id: event_id}).
				success(function(data, status, headers, config) {
					defer.resolve(data);
				}).
				error(function(data, status, headers, config) {
					defer.reject(data);
				});

			return defer.promise;
		},

	};
});
