(function (angular) {
	'use strict';

	function EntityController($scope, $element, $attrs, $compile, $uibModal) {
		var ctrl = this;

		ctrl.$onInit = function () {
			// add handler
			angular.element($element).draggable({
				drag: function (event, ui) {
					if (ui.position.left < 0) {
						ui.position.left = 0;
					}
					if (ui.position.top < 0) {
						ui.position.top = 0;
					}
				}
			});
		};

		ctrl.addAttribute = function ($itemScope) {
			ctrl.addNewAttributeModal().then(function (data) {
				ctrl.entity.addAttribute(data);
			});
		};

		/**
		 * Edit an attribute
		 * @param index array index of the attribute
		 */
		ctrl.editAttribute = function (index) {
			ctrl.editAttributeModal(ctrl.entity.getAttribute(index)).then(function (data) {
				ctrl.entity.editAttribute(index, data);
			});
		};

		ctrl.removeAttribute = function (index) {
			ctrl.entity.removeAttribute(index);
		}

		ctrl.menuOptions = [
			['Add attribute', ctrl.addAttribute],
			null,
			['Rename', function () {
				console.log('Rename');
			}],
			null,
			['Remove', function () {
				console.log('Remove');
			}]
		];

		// modal related
		ctrl.addNewAttributeModal = function () {
			var modalInstance = $uibModal.open({
				templateUrl: 'new-attribute-prompt.html',
				controller: 'AttributeModalCtrl',
				size: 'lg',
				resolve: {
					title: function () {
						return 'Create new attribute';
					}
				}
			});

			return modalInstance.result; // return the promise
		};

		/**
		 *
		 * @param size modal size
		 * @param attribute the Attribute model
		 * @returns {*}
		 */
		ctrl.editAttributeModal = function (attribute) {
			// create a scope for the modal that contains attribute data
			var newScope = $scope.$new(true);
			newScope.attributeData = {
				name: attribute.name,
				type: attribute.type,
				notNull: attribute.notNull,
				isPrimaryKey: attribute.isPrimaryKey,
				isForeignKey: attribute.isForeignKey
			};

			var modalInstance = $uibModal.open({
				templateUrl: 'new-attribute-prompt.html',
				controller: 'AttributeModalCtrl',
				size: 'lg',
				scope: newScope, // pass the scope created
				resolve: {
					title: function () {
						return 'Edit attribute';
					}
				}
			});

			return modalInstance.result; // return the promise
		};
	}

	angular.module('editor').component('erEntity', {
		bindings: {
			entity: '<',
			onUpdate: '&'
		},
		templateUrl: './app/components/editor/diagram/erEntity.html',
		controller: EntityController
	});
})(window.angular);