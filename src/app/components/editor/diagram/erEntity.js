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
			ctrl.addNewAttribute('lg').then(function (data) {
				ctrl.entity.addAttribute(data);
			});
		};

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
		ctrl.addNewAttribute = function (size) {
			var modalInstance = $uibModal.open({
				templateUrl: 'new-attribute-prompt.html',
				controller: 'NewAttributeModalCtrl',
				size: size
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