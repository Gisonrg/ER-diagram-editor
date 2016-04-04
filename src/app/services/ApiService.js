(function (angular) {
	'use strict';

	angular.module('myApp.services').factory('ApiService', function($window, $http) {
		var endpoint = 'http://localhost:8080/backend/api';
		// public api
		return {
			getEndpoint: function() { return endpoint; }
		};

	});
})(window.angular);