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

		ctrl.removeEntity = function (entity) {
			entity.destroy();
			editorManager.removeEntity(entity);
		};

		ctrl.removeRelationship = function (relationship) {
			relationship.destroy();
			editorManager.removeRelationship(relationship);
		};

		ctrl.onDropHandler = function (event, ui) {
			var offset = ui.offset;
			offset.left = offset.left + $('.editor').scrollLeft();
			offset.top = offset.top + $('.editor').scrollTop();

			if (offset.left < Math.round(containerLeftOffset)) {
				return;
			}
			// decide what diagram to add to the dom
			switch (ui.draggable[0].id) {
				case 'entity':
					ctrl.askForEntityName('lg').then(function (name) {
						ctrl.addNewEntity(offset, name);
					}, null);
					break;
				case 'relationship':
					ctrl.askForEntityName('lg').then(function (name) {
						ctrl.addNewRelationship(offset, name);
					}, null);
					break;
				default:
					console.log("No handler for this dropped object.");
			}
		};

		ctrl.checkNewNameAvailability = function (name) {
			return editorManager.isNameAvailable(name);
		};

		ctrl.addNewEntity = function (offset, name) {
			// check for the name
			if (!editorManager.isNameAvailable(name)) {
				alert('The name already exists in the database.');
				return;
			}
			var newScope = $scope.$new(false);
			newScope.entity = editorManager.createEntity(name);
			angular.element($compile('<er-entity id="{{entity.id}}" entity="entity" on-update="$ctrl.update()" on-rename="$ctrl.checkNewNameAvailability(name)" on-destroy="$ctrl.removeEntity(entity)"></er-entity>')(newScope))
				.css({position: 'absolute', top: offset.top, left: offset.left - containerLeftOffset})
				.appendTo(editorContainer);
		};

		$scope.$on('loadSchemaData', function(event, data) {
			data.entities.forEach(function(e) {
				ctrl.onLoadEntity(e);
			});

			data.relationships.forEach(function(e) {
				e.references.forEach(function(ref) {
					ref.from.entity = editorManager.getEntityByName(ref.from.entity);
					ref.from.attribute = ref.from.entity.getAttributeByName(ref.from.attribute);
				});
				ctrl.onLoadRelationship(e);
			});
		});

		ctrl.onLoadEntity = function (archivedData) {
			var newScope = $scope.$new(false);
			newScope.entity = editorManager.createEntity(archivedData.name);
			// add attributes
			archivedData.attributes.forEach(function(newAttr) {
				newAttr.type = new DataType(newAttr.type.name, newAttr.type.length);
				newScope.entity.addAttribute(newAttr);
			});

			// newScope.toAddAttributes = archivedData.attributes;
			angular.element($compile('<er-entity id="{{entity.id}}" entity="entity" needs-load-attribute="true" on-update="$ctrl.update()" on-rename="$ctrl.checkNewNameAvailability(name)" on-destroy="$ctrl.removeEntity(entity)"></er-entity>')(newScope))
				.css({position: 'absolute', top: archivedData.position.top, left: archivedData.position.left})
				.appendTo(editorContainer);
		};

		ctrl.onLoadRelationship = function (archivedData) {
			var newScope = $scope.$new(false);
			newScope.relationship = editorManager.createRelationship(archivedData.name);
			// add attributes
			archivedData.attributes.forEach(function(newAttr) {
				newAttr.type = new DataType(newAttr.type.name, newAttr.type.length);
				newScope.relationship.addAttribute(newAttr);
			});

			newScope.toAddReferences = archivedData.references;
			angular.element($compile('<er-relationship id="{{relationship.id}}" to-add-references="toAddReferences" needs-load-attribute="true" on-add-reference="$ctrl.addNewReference(relationship)" on-edit-reference="$ctrl.editReference(ref)" on-rename="$ctrl.checkNewNameAvailability(name)" on-destroy="$ctrl.removeRelationship(relationship)" model="relationship"></er-relationship>')(newScope))
				.css({position: 'absolute', top: archivedData.position.top, left: archivedData.position.left})
				.appendTo(editorContainer);
		};

		ctrl.addNewRelationship = function (offset, name) {
			if (!editorManager.isNameAvailable(name)) {
				alert('The name already exists in the database.');
				return;
			}
			var newScope = $scope.$new(false);
			newScope.relationship = editorManager.createRelationship(name);
			angular.element($compile('<er-relationship id="{{relationship.id}}" on-add-reference="$ctrl.addNewReference(relationship)" on-edit-reference="$ctrl.editReference(ref)" on-rename="$ctrl.checkNewNameAvailability(name)" on-destroy="$ctrl.removeRelationship(relationship)" model="relationship"></er-relationship>')(newScope))
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

		ctrl.addNewReference = function () {
			var modalInstance = $uibModal.open({
				templateUrl: 'new-reference-prompt.html',
				controller: 'ReferenceModalCtrl',
				size: 'lg',
				resolve: {
					title: function () {
						return 'Add new reference';
					},
					reference: function () {
						return null;
					},
					entities: function () {
						return editorManager.getAllEntities();
					}
				}
			});

			return modalInstance.result; // return the promise
		};

		ctrl.editReference = function (reference) {
			var modalInstance = $uibModal.open({
				templateUrl: 'new-reference-prompt.html',
				controller: 'ReferenceModalCtrl',
				size: 'lg',
				resolve: {
					title: function () {
						return 'Edit reference';
					},
					reference: function () {
						return reference;
					},
					entities: function () {
						return editorManager.getAllEntities();
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