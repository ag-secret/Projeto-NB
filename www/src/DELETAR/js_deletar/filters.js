angular.module('starter.filters', [])

.filter('labelMaxAge', function(){
	return function (age, max){
		if (age >= max) {
			return age + '+';
		}
		return age;
	};

});