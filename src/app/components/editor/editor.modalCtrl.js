(function (angular) {
	'use strict';

	angular.module('editor').controller('PromptModalCtrl', function($scope, $uibModalInstance, title) {
		$scope.title = title;

		$scope.ok = function () {
			$uibModalInstance.close($scope.data);
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});

	angular.module('editor').controller('NewAttributeModalCtrl', function($scope, $uibModalInstance) {
		$scope.typeList = [
			'INTEGER', 'VARCHAR', 'TEXT'
		];

		$scope.data = {
			name : '',
			type: 'INTEGER'
		};
		$scope.ok = function () {
			$uibModalInstance.close($scope.data);
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});

})(window.angular);