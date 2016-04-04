(function (angular) {
	'use strict';

	angular.module('myApp.services').factory('UserService', function (ApiService, $http) {

		var loginUser = function (email, password) {
			return $http({
				url: ApiService.getEndpoint() + '/auth/login',
				data: {
					email: email,
					password: password
				},
				method: 'POST'
			});
		};

		var registerUser = function (email, password) {
			return $http({
				url: ApiService.getEndpoint() + '/auth/signup',
				data: {
					email: email,
					password: password
				},
				method: 'POST'
			});
		};

		// public api
		return {
			login: loginUser,
			signUp: registerUser
		};

	});
})(window.angular);