(function (angular) {
	'use strict';
	MainController.$inject = [
		'$scope', '$element', '$attrs', 'editorManager',
		'$uibModal', '$sessionStorage', '$alert',
		'UserService', 'SchemaService'
	];
	// The main component for the application
	function MainController($scope, $element, $attrs, editorManager, $uibModal, $sessionStorage, $alert, UserService, SchemaService) {
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
		var loginErrorAlert = $alert({
			title: 'Oops, please check your user details',
			templateUrl: 'app-alert.html',
			container: 'body',
			placement: 'top-right',
			type: 'danger',
			duration: 2,
			show: false
		});
		var doneAlert = $alert({
			title: 'Done',
			templateUrl: 'app-alert.html',
			container: 'body',
			placement: 'top-right',
			type: 'info',
			duration: 2,
			show: false
		});
		var errorAlert = $alert({
			title: 'Oops, something goes wrong',
			templateUrl: 'app-alert.html',
			container: 'body',
			placement: 'top-right',
			type: 'danger',
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

			var savedData = {
				entities: archivedEntities,
				relationships: archivedRelationships
			};

			ctrl.askForName($sessionStorage.get('schemaName')).then(function (name) {
				SchemaService.saveSchema(name, JSON.stringify(savedData))
					.success(function() {
						successAlert.show();
					})
					.error(function(error) {
						errorAlert.show();
					});
			});
		};

		ctrl.loadSchemaData = function () {
			SchemaService.getSchemas()
				.success(function(data) {
					ctrl.showSavedSchemas(data).then(function(id) {
						SchemaService.getSchema(id)
							.success(function(data) {
								$scope.$broadcast('clearAllData');
								$scope.$broadcast('loadSchemaData', JSON.parse(data.diagram.data));
								successAlert.show();
							})
							.error(function(error) {
								errorAlert.show();
							})
					});
				})
				.error(function(error) {
					errorAlert.show();
				});
		};

		ctrl.clearSchemaData = function () {
			$scope.$broadcast('clearAllData');
			doneAlert.show();
		};

		/*
		User related
		 */
		ctrl.login = function(email, password) {
			UserService.login(email, password)
				.success(function(response) {
					$sessionStorage.set('token', response.token);
					successAlert.show();
					$scope.$broadcast('user:login');
				})
				.error(function() {
					loginErrorAlert.show();
				});
		};

		ctrl.signup = function(email, password) {
			UserService.signUp(email, password)
				.success(function(response) {
					$sessionStorage.set('token', response.token);
					$scope.$broadcast('user:login');
					successAlert.show();
				})
				.error(function() {
					loginErrorAlert.show();
				});
		};

		ctrl.logout = function() {
			$sessionStorage.remove('token');
			$scope.$broadcast('clearAllData');
			doneAlert.show();
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

		ctrl.askForName = function (name) {
			var modalInstance = $uibModal.open({
				templateUrl: 'save-schema-modal.html',
				controller: 'SaveSchemaModalCtrl',
				size: 'lg',
				resolve: {
					name: function () {
						return name;
					}
				}
			});
			return modalInstance.result;
		};

		ctrl.showSavedSchemas = function (data) {
			var modalInstance = $uibModal.open({
				templateUrl: 'view-all-schemas.html',
				controller: 'ViewSchemasModalCtrl',
				size: 'lg',
				resolve: {
					data: function () {
						return data;
					}
				}
			});
			return modalInstance.result;
		};
	}

	angular.module('myApp').component('mainApp', {
		templateUrl: './app/main.html',
		controller: MainController
	});

})(window.angular);
