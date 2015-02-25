angular.module('starter', [
	'ionic',
	// Components
	'starter.component.Common',
	'starter.component.customLoading',
	// Controllers
	'starter.DispatcherController',
	'starter.LoginController',
	'starter.RateProfilesController',
	'starter.MatchesController',
		'starter.ChatController',
		'starter.MatchProfileController',
	'starter.SettingsController',
	'starter.ProfilePicturesController',
	'starter.TesteController',
	// Models
	'starter.model.Me',
	'starter.model.Profile',
	'starter.model.Match',
	'starter.model.Event',
	// Filters
	'starter.Filter.filters',
	// 'starter.services',
	
	// 'starter.storage',
	'firebase',
	'LocalStorageModule',
	'ngCordova'
])

.constant('PRODUCTION', false)
// .constant('WEBSERVICE_URL', 'http://192.168.254.103:777/projeto_nb_webservice')
.constant('WEBSERVICE_URL', 'http://bbgl.kinghost.net')
.constant('FACEBOOK_APP_ID', 401554549993450)
.constant('PUSH_NOTIFICATION_SENDER_ID', '552977488644')

.run(function($ionicPlatform, $rootScope, $cordovaPush) {

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
	    	alert('Recebeu');
	      switch(notification.event) {
	        case 'message':
	          // this is the actual push notification. its format depends on the data model from the push server
	          alert(JSON.stringify(notification));
	          break;

	        case 'error':
	          alert('GCM error = ' + notification.msg);
	          break;

	        default:
	          alert('An unknown GCM event has occurred');
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
		templateUrl: "src/Template/tabs.html",
		// controller: "AppController"
	})

	.state('tab.teste', {
		url: '/teste',
		views: {
			'tab-teste': {
				templateUrl: 'src/Template/tab-teste/teste.html',
				controller: 'TesteController'
			}
		}
	})
	/*
		Dispatcher
	 */
	.state('dispatcher', {
		url: '/dispatcher',
		templateUrl: 'src/Template/dispatcher.html',
		controller: 'DispatcherController'
	})
	/*
	* Login
	 */
	.state('login', {
		url: '/login',
		templateUrl: 'src/Template/login.html',
		controller: 'LoginController'
	})
	
	/*
		RateProfile
	 */
	.state('tab.rate-profiles', {
		url: '/rate-profiles',
		views: {
			'tab-rate-profiles': {
				templateUrl: 'src/Template/tab-rate-profiles/rate-profiles.html',
				controller: 'RateProfilesController'
			}
		}
	})

	/**
	 * Combinações
	 */
	.state('tab.matches', {
		url: '/matches',
		views: {
			'tab-matches': {
				templateUrl: 'src/Template/tab-matches/matches.html',
				controller: 'MatchesController'
			}
		}
	})
		.state('tab.chat', {
			url: '/chat/:id',
			views: {
				'tab-matches': {
					templateUrl: 'src/Template/tab-matches/chat.html',
					controller: 'ChatController'
				}
			}
		})
		.state('tab.match-profile', {
			url: '/match-profile/:id',
			views: {
				'tab-matches': {
					templateUrl: 'src/Template/tab-matches/match-profile.html',
					controller: 'MatchProfileController'
				}
			}
		})

	/*
	 * Settings
	 */
	.state('tab.settings', {
		url: '/settings',
		views: {
			'tab-settings': {
				templateUrl: 'src/Template/tab-settings/settings.html',
				controller: 'SettingsController'
			}
		}
	})
		.state('tab.profile-pictures', {
			url: '/profile-pictures',
			views: {
				'tab-settings': {
					templateUrl: 'src/Template/tab-settings/profile-pictures.html',
					controller: 'ProfilePicturesController'
				}
			}
		});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/dispatcher');

});
