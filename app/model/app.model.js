(function (angular) {
	'use strict';
	angular.module('myApp.model', []);

	angular.module('myApp.model')
		.constant('DataType', [
			new DataType('INTEGER'),
			new DataType('NUMERIC'),
			new DataType('VARCHAR', 128),
			new DataType('TEXT'),
			new DataType('DATE'),
			new DataType('TIMESTAMP')
		]);
})(window.angular);