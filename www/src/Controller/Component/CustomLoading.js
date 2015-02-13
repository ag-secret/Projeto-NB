angular.module('starter.component.customLoading', [])


.factory('CustomLoading', function($ionicLoading){

	var loaderSimple = 'icon ion-loading-b';

	return {
		simple: function(text){
			text = '<span class="'+loaderSimple+'"></span> ' + text;
			return $ionicLoading.show(
				{
					template: text,
					hideOnStateChange: true,
				}
			);
		},
		hide: function(){
			return $ionicLoading.hide();
		}
	};
});
