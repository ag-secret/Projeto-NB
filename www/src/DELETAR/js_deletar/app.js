// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
	'ionic',
	'starter.controllers',
	'starter.services',
	'starter.filters',
	'starter.storage',
	'firebase',
	'LocalStorageModule',
	'ngCordova'
])

.run(function($ionicPlatform, $rootScope, $cordovaPush, Me) {

	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}

        $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
          switch(notification.event) {
            // case 'registered':
            //   if (notification.regid.length > 0 ) {
            //     alert(notification.regid);

            //     Me.saveAndroidDeviceRegistrationId(notification.regid).then(function(result){
            //         alert('Salvou joia');
            //     }, function(err){
            //         alert('Deu ruim pra salvar');
            //     });
            //   }
            //   break;

            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
              break;

            case 'error':
              alert('GCM error = ' + notification.msg);
              break;

            default:
              // alert('An unknown GCM event has occurred');
              break;
          }
        });


	});
})


.config(function($stateProvider, $urlRouterProvider) {

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider

	// setup an abstract state for the tabs directive
	.state('tab', {
		url: "/tab",
		abstract: true,
		templateUrl: "templates/tabs.html",
		controller: "AppController"
	})

	// Each tab has its own nav history stack:

	.state('dispatcher', {
		url: '/dispatcher',
		templateUrl: 'templates/dispatcher.html',
		controller: 'DispatcherController'
	})
	.state('auth', {
		url: '/login',
		templateUrl: 'templates/login.html',
		controller: 'LoginController'
	})
	.state('logout', {
		url: '/logout',
		// templateUrl: 'templates/login.html',
		controller: 'LogoutController'
	})

	.state('tab.teste-distancia', {
		url: '/teste-distancia',
		views: {
			'tab-teste-distancia': {
				templateUrl: 'templates/tab-teste-distancia.html',
				controller: 'TesteDistanciaController'
			}
		}
	})

	.state('tab.my-settings', {
		url: '/my-settings',
		views: {
			'tab-my-settings': {
				templateUrl: 'templates/tab-my-settings.html',
				controller: 'MySettingsController'
			}
		}
	})
		.state('tab.profile-pictures', {
			url: '/profile-pictures',
			views: {
				'tab-my-settings': {
					templateUrl: 'templates/profile-pictures.html',
					controller: 'ProfilePicturesController'
				}
			}
		})

	.state('tab.search', {
		url: '/search',
		views: {
			'tab-search': {
				templateUrl: 'templates/tab-search.html',
				controller: 'SearchController'
			}
		}
	})
		.state('tab.search-events', {
			url: '/search-events',
			views: {
				'tab-search': {
					templateUrl: 'templates/search-events.html',
					controller: 'SearchEventsController'
				}
			}
		})
		.state('tab.rate-profiles', {
			url: '/rate-profiles/:eventName',
			views: {
				'tab-search': {
					templateUrl: 'templates/rate-profiles.html',
					controller: 'RateProfilesController'
				}
			}
		})



	.state('tab.chats', {
			url: '/chats',
			views: {
				'tab-chats': {
					templateUrl: 'templates/tab-chats.html',
					controller: 'ChatsController'
				}
			}
		})
		.state('tab.chat-detail', {
			url: '/chat/:chatId',
			views: {
				'tab-chats': {
					templateUrl: 'templates/chat-detail.html',
					controller: 'ChatDetailController'
				}
			}
		})
		.state('tab.match-profile', {
			url: '/match-profile/:matchId',
			views: {
				'tab-chats': {
					templateUrl: 'templates/match-profile.html',
					controller: 'MatchProfileController'
				}
			}
		});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/dispatcher');

})
;
