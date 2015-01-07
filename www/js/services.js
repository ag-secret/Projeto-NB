angular.module('starter.services', [])

.factory('Matches', function(){
	var matches = [
		{
			id: 1,
			name: 'Drizzy Drake',
			age: 35,
			img: 'drake.jpg',
			event: 'Open Bar',
			club: 'Pullse',
			messages: [
				{
					account_id: 1,
					message: 'Oi cara jóia?'
				},
				{
					account_id: 999,
					message: 'Bem e vc?'
				},
				{
					account_id: 999,
					message: 'Tú é o Drake mesmo cara? nem acredito, tranquilo ai meu parcero?'
				},
				{
					account_id: 1,
					message: 'Tú é o Drake mesmo cara? nem acredito, tranquilo ai meu parcero?'
				}
			]
		},
		{
			id: 2,
			name: 'Little Waynne',
			age: 36,
			img: 'lil.jpg',
			event: 'Show Cone Crew Diretoria',
			club: 'Cana Café'
		},
		{
			id: 3,
			name: 'Nicki Nicki',
			age: 26,
			img: 'minaj.jpg',
			event: 'Show Cone Crew Diretoria',
			club: 'Cana Café'
		},
		{
			id: 4,
			age: 35,
			name: 'Katy Perry',
			img: 'katy.jpg',
			event: 'Open Bar',
			club: 'Pullse'
		},
	];
	return {
		all: function(){
			return matches;
		},
		get: function (id) {
			for (var i = 0; i < matches.length; i++) {
				if (matches[i].id === parseInt(id)) {
					return matches[i];
				}
			}
			return null;
		}
	};
})

.factory('Events', function(){
	var events = [
		{
			name: 'Pullse',
		},
		{
			name: 'Cana Café',
		}
	];

	return {
		get: function(){
			return events;
		}
	};
})

.factory('Profiles', function(){
	var profiles = [
		{
			id: 1,
			name: 'Drizzy Drake',
			age: 35,
			img: 'drake.jpg',
		},
		{
			id: 2,
			name: 'Little Waynne',
			age: 36,
			img: 'lil.jpg',
		},
		{
			id: 3,
			name: 'Nicki Nicki',
			age: 26,
			img: 'minaj.jpg',
		},
		{
			id: 4,
			age: 35,
			name: 'Katy Perry',
			img: 'katy.jpg',
		},
	];
	return {
		all: function(){
			return profiles;
		},
		get: function (id) {
			for (var i = 0; i < profiles.length; i++) {
				if (profiles[i].id === parseInt(id)) {
					return profiles[i];
				}
			}
			return null;
		}
	};
});
