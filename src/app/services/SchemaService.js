(function (angular) {
	'use strict';

	angular.module('myApp.services').factory('SchemaService', function($http, ApiService, $sessionStorage) {
		var getSchemas = function() {
			var token = $sessionStorage.get('token');
			return $http({
				url: ApiService.getEndpoint() + '/schema',
				params: {
					token: token
				},
				method: 'GET'
			});
		};

		var getSchema = function(id) {
			var token = $sessionStorage.get('token');
			return $http({
				url: ApiService.getEndpoint() + '/schema/' + id,
				params: {
					token: token
				},
				method: 'GET'
			});
		};

		var saveSchema = function(name, data) {
			var token = $sessionStorage.get('token');
			var payload = {
				name: name,
				data: data
			}

			return $http({
				url: ApiService.getEndpoint() + '/schema',
				params: {
					token: token
				},
				data: payload,
				method: 'POST'
			});
		};

		// public api
		return {
			getSchemas: getSchemas,
			getSchema: getSchema,
			saveSchema: saveSchema
		};

	});
})(window.angular);