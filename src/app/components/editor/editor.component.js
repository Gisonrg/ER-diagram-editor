(function (angular) {
	'use strict';

	EditorController.$inject = ['$scope', '$element', '$attrs', '$compile', '$uibModal', 'editorManager'];
	// The main component for the application
	function EditorController($scope, $element, $attrs, $compile, $uibModal, editorManager) {
		var ctrl = this;

		var editorSelector = '.editor-container';
		var editorContainer = angular.element($element[0].querySelector(editorSelector));
		var containerLeftOffset = editorContainer.offset().left;

		// handler model update
		ctrl.update = function () {
			console.log('update from editor');
		};

		ctrl.onDropHandler = function (event, ui) {
			var offset = ui.offset;

			// decide what diagram to add to the dom
			switch (ui.draggable[0].id) {
				case "entity":
					ctrl.askForEntityName('lg').then(function (name) {
						console.log("Adding new entity named " + name + " to the editor");
						ctrl.addNewEntity(offset, name);
					}, null);
					break;
				default:
					console.log("No handler for this dropped object.");
			}
		};

		ctrl.addNewEntity = function (offset, name) {
			var newScope = $scope.$new(true);
			newScope.entity = editorManager.createEntity(name);
			angular.element($compile('<er-entity entity="entity" on-update="$ctrl.update()"></er-entity>')(newScope))
				.css({position: 'absolute', top: offset.top, left: offset.left - containerLeftOffset})
				.appendTo(editorContainer);
		};

		// modal related
		ctrl.askForEntityName = function (size) {
			var modalInstance = $uibModal.open({
				templateUrl: 'input-prompt.html',
				controller: 'PromptModalCtrl',
				size: size,
				resolve: {
					title: function () {
						return 'Please enter new entity name';
					}
				}
			});

			return modalInstance.result; // return the promise
		};
	}

	angular.module('editor').component('editor', {
		templateUrl: './app/components/editor/editor.html',
		controller: EditorController
	});

})(window.angular);