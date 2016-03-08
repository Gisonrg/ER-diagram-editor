(function (angular) {
	'use strict';

	angular.module('editor').controller('PromptModalCtrl', function ($scope, $uibModalInstance, title) {
		$scope.title = title;

		$scope.ok = function () {
			$uibModalInstance.close($scope.data);
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});

	angular.module('editor').controller('NewAttributeModalCtrl', function ($scope, $uibModalInstance, DataType) {
		$scope.typeList = DataType;

		$scope.data = {
			name: '',
			type: DataType[0],
			notNull: false,
			isPrimaryKey: false,
			isForeignKey: false
		};

		$scope.ok = function () {
			$uibModalInstance.close($scope.data);
		};

		$scope.togglePrimaryKey = function () {
			if ($scope.data.isPrimaryKey) {
				// if primary key is selected, make it not null
				$scope.data.notNull = true;
			}
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});

})(window.angular);