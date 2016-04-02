(function (angular) {
	'use strict';
	MainController.$inject = ['$scope', '$element', '$attrs', 'editorManager', '$uibModal', '$sessionStorage', '$alert'];
	// The main component for the application
	function MainController($scope, $element, $attrs, editorManager, $uibModal, $sessionStorage, $alert) {
		var ctrl = this;
		var successAlert = $alert({
			title: 'Success',
			templateUrl: 'app-alert.html',
			container: 'body',
			placement: 'top-right',
			type: 'success',
			duration: 1,
			show: false
		});
		var deleteAlert = $alert({
			title: 'Done',
			templateUrl: 'app-alert.html',
			container: 'body',
			placement: 'top-right',
			type: 'info',
			duration: 2,
			show: false
		});
		// component event
		ctrl.generateSchemaData = function () {
			var data = editorManager.generateSchemaData();
			ctrl.showJsonModal(data);
		};

		ctrl.saveSchemaData = function () {
			var entities = editorManager.getAllEntities();
			var relationships = editorManager.getAllRelationships();
			var archivedEntities = entities.map(function (e) {
				return e.archive();
			});
			var archivedRelationships = relationships.map(function (e) {
				return e.archive();
			});

			$sessionStorage.setObject('data', {
				entities: archivedEntities,
				relationships: archivedRelationships
			});
			successAlert.show();
		};

		ctrl.loadSchemaData = function () {
			successAlert.show();
			var data = $sessionStorage.getObject('data');
			$scope.$broadcast('clearAllData');
			$scope.$broadcast('loadSchemaData', data);
		};

		ctrl.clearSchemaData = function () {
			deleteAlert.show();
			$scope.$broadcast('clearAllData');
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
