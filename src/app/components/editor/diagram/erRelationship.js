(function (angular) {
	'use strict';

	function RelationshipController($scope, $element, $attrs, $compile, $uibModal) {
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
	}

	angular.module('editor').component('erRelationship', {
		bindings: {
			model: '<',
			onUpdate: '&'
		},
		templateUrl: './app/components/editor/diagram/erRelationship.html',
		controller: RelationshipController
	});
})(window.angular);