(function (angular) {
	'use strict';
	// The main component for the application
	function ToolbarController($scope, $element, $attrs) {
		var ctrl = this;

	}

	angular.module('toolbar').component('toolbar', {
		bindings: {
			onGenerate : '&',
			onClearData: '&',
			onLoadData: '&',
			onSaveData: '&'
		},
		templateUrl: './app/common/toolbar/toolbar.html',
		controller: ToolbarController
	});

})(window.angular);