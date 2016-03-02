(function (angular) {
	'use strict';
	MainController.$inject = ['$scope', '$element', '$attrs', 'editorManager', '$uibModal'];
	// The main component for the application
	function MainController($scope, $element, $attrs, editorManager, $uibModal) {
		var ctrl = this;

		// component event
		ctrl.generateSchemaData = function () {
			var data = editorManager.generateSchemaData();
			ctrl.showJsonModal(data);
		};

		ctrl.showJsonModal = function (data) {
			var modalInstance = $uibModal.open({
				templateUrl: 'json-data-viewer.html',
				controller: 'JsonViewerModalCtrl',
				size: 'lg',
				resolve: {
					data: function () {
						return data;
					}
				}
			});
		};
	}

	angular.module('myApp').component('mainApp', {
		templateUrl: './app/main.html',
		controller: MainController
	});

})(window.angular);
