(function (angular) {
	'use strict';
	angular.module('myApp').controller('JsonViewerModalCtrl', function ($scope, $uibModalInstance, data) {
		$scope.data = data;

		$scope.ok = function () {
			$uibModalInstance.close();
		};
	});

})(window.angular);