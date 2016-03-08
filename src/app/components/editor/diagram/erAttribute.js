(function (angular) {
	'use strict';

	function AtrributeController($scope, $element, $attrs) {
		var ctrl = this;
		ctrl.$onInit = function () {

		};

		ctrl.menuOptions = [
			['Edit', function () {
				console.log('edit');
				console.log('index', ctrl.attrIndex);
			}]
		];
	}

	angular.module('editor').component('erAttribute', {
		bindings: {
			attribute: '<',
			attrIndex: '<' // track which index this entity is from
		},
		templateUrl: './app/components/editor/diagram/erAttribute.html',
		controller: AtrributeController
	});
})(window.angular);