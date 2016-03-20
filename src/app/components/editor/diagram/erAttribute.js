(function (angular) {
	'use strict';

	function AtrributeController($scope, $element, $attrs) {
		var ctrl = this;
		ctrl.$onInit = function () {
			ctrl.attribute.dom = $element;
		};

		ctrl.menuOptions = [
			['Edit', function () {
				ctrl.onEdit(); // call handler
			}],
			['Remove', function () {
				ctrl.onRemove(); // call handler
			}]
		];
	}

	angular.module('editor').component('erAttribute', {
		bindings: {
			attribute: '<',
			onEdit: '&', // edit attribute,
			onRemove: '&' // remove this attribute
		},
		templateUrl: './app/components/editor/diagram/erAttribute.html',
		controller: AtrributeController
	});
})(window.angular);