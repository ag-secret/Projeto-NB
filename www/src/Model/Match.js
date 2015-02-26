angular.module('starter.model.Match', [])

.factory('Match', function(
	$cordovaOauth,
	$cordovaPush,
	$http,
	$ionicPlatform,
	$q,
	$rootScope,
	Me,
	localStorageService,
	/**
	 * Constantes
	 */
	WEBSERVICE_URL
){

	return {
		matches: [],
		/**
		 * Modelo do array de mensagens
		 */
			// messages: [
			// 	{
			// 		account_id: int,
			// 		lastUpdate: y-m-d h:i:s,
			// 		messages: [
			// 			{
			// 				account_id1: int,
			// 				account_id2: int
			// 				message: string,
			// 				created: y-m-d h:i:s
			// 			}
			// 		]
			// 	}
			// ],
		messages: [],
		getLocalMessagesByAccount: function(account_id){
			var _this = this;
			for (i = 0; i < _this.messages.length; i++) {
				if (_this.messages[i].account_id == account_id) {
					return _this.messages[i];
				}
			}

			return null;
		},
		getTotalMatches: function(){
			var _this = this;
			var defer = $q.defer();

			$http.get(WEBSERVICE_URL + '/combinations/getTotalMatches?id=' + Me.account.id)
				.success(function(data){
					defer.resolve(data);
				})
				.error(function(data){
					defer.reject(data);
				});

			return defer.promise;
		},
		updateMessagesByAccount: function(account_id, data){
			var _this = this;
			for (i = 0; i < _this.messages.length; i++) {
				if (_this.messages[i].account_id == account_id) {
					_this.messages[i].lastUpdate = data.lastUpdate;
					var messagesUpdated = _this.messages[i].messages.concat(data.messages);
					_this.messages[i].messages = messagesUpdated;
					console.log('Editado');
					console.log(_this.messages);
					return true;
				}
			}
			_this.messages.push(data);
			console.log('Novo');
			console.log(_this.messages);
			return true;
		},
		getMessagesByAccount: function(target){
			var _this = this;
			var defer = $q.defer();

			var info = _this.getLocalMessagesByAccount(target);
			var lastUpdate = (info) ? info.lastUpdate : null;

			$http.get(WEBSERVICE_URL + '/messages/get?id=' + Me.account.id + '&target=' + target + '&lastUpdate=' + lastUpdate)
				.success(function(data){
					if (data) {
						_this.updateMessagesByAccount(
							target,
							{
								account_id: target,
								lastUpdate: moment().format('YYYY-MM-DD h:mm:ss'),
								messages: data	
							}
						);
					}
					defer.resolve(_this.getLocalMessagesByAccount(target));
				})
				.error(function(data){
					defer.reject(data);
				});

			return defer.promise;
		},
		saveMessage: function(data){
			var _this = this;
			var defer = $q.defer();

			$http.post(
					WEBSERVICE_URL + '/messages?id=' + Me.account.id,
					data
				)
				.success(function(data){
					defer.resolve(data);
				})
				.error(function(data){
					defer.reject(data);
				});

			return defer.promise;
		},
		/**
		 * Pega combinações paginando de acordo com a página passada
		 *
		 * @param  {int} page Numero da página 
		 * @return {array}      Combinações
		 */
		getPaginate: function(page){
			var _this = this;
			var defer = $q.defer();

			$http.get(WEBSERVICE_URL + '/combinations/getMatches/'+page+'?id=' + Me.account.id)
				.success(function(data){
					_this.matches = data;
					defer.resolve(data);
				})
				.error(function(data){
					defer.reject(data);
				});

			return defer.promise;
		},
		getOne: function(id){
			var _this = this;
			// console.log(_this.matches);

			for (i = 0; i < _this.matches.length; i++) {
				if (_this.matches[i].id == id) {
					return _this.matches[i];
				}
			}

			return {};

		},

		setResponse: function(target, response){
			var defer = $q.defer();
			var _this = this;

			$http.post(
				WEBSERVICE_URL + '/combinations/setResponse?id=' + Me.account.id,
				{
					target: target,
					response: response
				}
			)
			.success(function(data, status, headers, config) {
				defer.resolve(data);
			})
			.error(function(data, status, headers, config) {
				defer.reject(data);
			});

			return defer.promise;	
		}
	};
});
