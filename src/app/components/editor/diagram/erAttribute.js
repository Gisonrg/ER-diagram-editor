(function (angular) {
	'use strict';

	function AtrributeController($scope, $element, $attrs) {
		var ctrl = this;
		ctrl.$onInit = function () {

		};

		ctrl.menuOptions = [
			['Edit', function () {
				console.log('edit');
			}]
		];
	}

	angular.module('editor').component('erAttribute', {
		bindings: {
			attribute: '<'
		},
		templateUrl: './app/components/editor/diagram/erAttribute.html',
		controller: AtrributeController
	});
})(window.angular);