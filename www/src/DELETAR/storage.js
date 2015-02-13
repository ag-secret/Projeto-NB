// JavaScript Document
angular.module('starter.storage', [])
.factory('$localstorage', ['$window', function($window) {
	return {
		set: function(key, value) {
			$window.localStorage[key] = value;
		},
		get: function(key, defaultValue) {
			return $window.localStorage[key] || defaultValue;
		},
		setObject: function(key, value) {
			$window.localStorage[key] = JSON.stringify(value);
		},
		getArray: function(key) {
			return JSON.parse($window.localStorage[key] || '[]');
		},
		save: function(model, data){
			//Faz o save ou update se tiver ID
			if ('id' in data) {
				this.update(model, data, data.id);
			} else {
				data.id = this.getLastId(model);
				this.setLastId(model, (data.id + 1));
				var todos = this.findAll(model);
				todos.push(data);
//				console.log(data);
				$window.localStorage[model] = JSON.stringify(todos);
			}
		},
		getLastId: function(model){
			return parseInt($window.localStorage[model + '_lastId']) || 1;
		},
		setLastId: function(model, lastId){
			$window.localStorage[model + '_lastId'] = lastId;
			return lastId;
		},
		findAll: function(model) {
			return JSON.parse($window.localStorage[model] || '[]');
		},
		findOne: function(model, id) {
			var todos = this.findAll(model);
			var total = todos.length;
			var count = 0;
			for (i = 0; i < total; i++) {
				if (todos[i].id == id) {
					break;
				}
				count++;
			}
			return todos[count];
		},
		removeItem: function(model){
			$window.localStorage.removeItem(model);
		},
		update: function(model, data, id){
			var todos = this.findAll(model);
			var total = todos.length;
			var count = 0;
			for (i = 0; i < total; i++) {
				if (todos[i].id == data.id) {
					data.id = id;
					todos[i] = data;
					break;
				}
				count++;
			}
			$window.localStorage[model] = JSON.stringify(todos);
		},
		delete: function(model, id) {
			var todos = this.findAll(model);
			var total = todos.length;
			var count = 0;
			for (i = 0; i < total; i++) {
				if (todos[i].id == id) {
					break;
				}
				count++;
			}
			todos.splice(count, 1);
			$window.localStorage[model] = JSON.stringify(todos);
		}
	};
}]);