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

	angular.module('editor').controller('ReferenceModalCtrl', function ($scope, $uibModalInstance, title, entities, DataType, reference) {
		$scope.title = title;
		$scope.typeList = DataType;
		$scope.entities = entities;
		$scope.reference = reference;

		$scope.data = $scope.entities.length === 0 ? {} : {
			entity: $scope.entities[0],
			attribute: $scope.entities[0].getAttribute(0),
			name: '',
			type: ($scope.entities[0].getAttribute(0) && $scope.entities[0].getAttribute(0).type) || DataType[0],
			isPrimaryKey: true
		};

		if (reference) {
			console.log('update reference data');
			$scope.data = {
				entity: $scope.reference.from.entity,
				attribute: $scope.reference.from.attribute,
				name: $scope.reference.name,
				type: $scope.reference.type,
				isPrimaryKey: $scope.reference.isPrimaryKey
			};
		}

		$scope.updateSelectedAttribute = function () {
			$scope.data.attribute = $scope.data.entity.getAttribute(0);
		};


		$scope.ok = function () {
			if (!$scope.validateName($scope.data.name)) {
				return;
			}
			$uibModalInstance.close($scope.data);
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.validateName = function (name) {
			return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
		}
	});

	angular.module('editor').controller('ViewDetailModalCtrl', function ($scope, $uibModalInstance, onEditReference, title, references, DataType) {
		$scope.title = title;
		$scope.typeList = DataType;
		$scope.references = references;
		$scope.onEditReference = onEditReference;

		$scope.editReference = function(index) {
			console.log('edit reference of index ', index);
			$scope.onEditReference({ref:$scope.references[index]}).then(function(data) {
				$scope.references[index].onUpdate(data.entity, data.attribute, data.name, data.type, data.isPrimaryKey);
				return $uibModalInstance.close();
			});
		};

		$scope.removeReference = function(index) {
			$scope.references[index].onRemove();
		};

		$scope.ok = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});

})(window.angular);