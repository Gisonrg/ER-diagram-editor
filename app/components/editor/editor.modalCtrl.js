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

	angular.module('editor').controller('AttributeModalCtrl', function ($scope, $uibModalInstance, title, DataType) {
		$scope.title = title;
		$scope.typeList = DataType;

		/**
		 * $scope.attributeData exists if it's editing an attribute
		 */
		if ($scope.attributeData) {
			// now editing an existing attribute
			// can do some checking here
		}
		$scope.data = $scope.attributeData || {
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

	angular.module('editor').controller('ReferenceModalCtrl', function ($scope, $uibModalInstance, title, entities, DataType) {
		$scope.title = title;
		$scope.typeList = DataType;
		$scope.entities = entities;

		$scope.data = $scope.entities.length === 0 ? {} : {
			entity: $scope.entities[0],
			attribute: $scope.entities[0].getAttribute(0),
			name: '',
			type: ($scope.entities[0].getAttribute(0) && $scope.entities[0].getAttribute(0).type) || DataType[0],
			isPrimaryKey: true
		};

		$scope.updateSelectedAttribute = function () {
			$scope.data.attribute = $scope.data.entity.getAttribute(0);
		};


		$scope.ok = function () {
			$uibModalInstance.close($scope.data);
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.validateName = function (name) {
			return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
		}
	});

})(window.angular);