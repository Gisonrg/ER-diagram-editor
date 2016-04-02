(function (angular) {
	'use strict';

	function RelationshipController($scope, $element, $attrs, $compile, $uibModal) {
		var ctrl = this;

		ctrl.connectors = [];
		ctrl.relationConnectors = [];

		ctrl.$onInit = function () {
			ctrl.model.dom = $element;
			// add handler
			angular.element($element).draggable({
				drag: function (event, ui) {
					if (ui.position.left < 0) {
						ui.position.left = 0;
					}
					if (ui.position.top < 0) {
						ui.position.top = 0;
					}
					ctrl.redrawConnectors();
					ctrl.redrawRelationConnectors();
				}
			});

			// check if need to load attributes
			if (ctrl.needsLoadAttribute) {
				ctrl.model.attributes.forEach(function(newAttr) {
					ctrl.addConnectors(new Connector(ctrl.model, newAttr));
				});
			}

			if (ctrl.toAddReferences) {
				ctrl.toAddReferences.forEach(function(ref) {
					var data = {
						entity: ref.from.entity,
						attribute: ref.from.attribute,
						name: ref.name,
						type: new DataType(ref.type.name, ref.type.length),
						isPrimaryKey: ref.isPrimaryKey
					};
					ctrl.model.addReference(ctrl, data);
					ctrl.addRelationConnectors(data.entity);
				});
			}
		};

		// Event handler
		$scope.$on('clearAllData', function() {
			ctrl.removeModel();
		});

		/*
		 Rendering related
		 */
		$scope.$on('attr:done', function () {
			ctrl.alignAttributes();
		});

		$scope.$on('attr:remove', function () {
			ctrl.alignAttributes();
		});

		ctrl.alignAttributes = function () {
			var radius = 150, // radius of the circle
				elementWidth = 100 / 2,
				elementHeight = 28 / 2;

			var fields = angular.element('#relationship-' + ctrl.model.name + ' er-attribute'),
				width = 200,
				height = 120,
				angle = Math.PI / 2,
				step = (2 * Math.PI) / fields.length;

			// for drawing
			fields.each(function () {
				var x = Math.round(width / 2 + radius * Math.cos(angle) - elementWidth);
				var y = Math.round(height / 2 + radius * Math.sin(angle) - elementHeight);
				angular.element(this).css({
					position: 'absolute',
					left: x + 'px',
					top: y + 'px'
				});

				angle += step;
			});

			ctrl.redrawConnectors();
		};

		ctrl.redrawConnectors = function () {
			ctrl.connectors.forEach(function (e) {
				e.redraw();
			});
		};

		ctrl.redrawRelationConnectors = function () {
			ctrl.relationConnectors.forEach(function (e) {
				e.redraw();
			});
		};

		/**
		 *
		 * @param {Entity} toEntity
		 */
		ctrl.addRelationConnectors = function (toEntity) {
			var hasConnected = ctrl.relationConnectors.some(function (connector) {
				if (connector.diagram2 === toEntity || connector.diagram1 === toEntity) {
					return true;
				}
			});
			if (hasConnected) {
				return;
			}
			ctrl.relationConnectors.push(new RelationConnector(ctrl.model, toEntity));
			ctrl.redrawRelationConnectors();
		};

		ctrl.removeRelationConnectors = function (toEntity) {
			var flag = -1;
			for (var i = 0; i < ctrl.relationConnectors.length; i++) {
				var relationConnector = ctrl.relationConnectors[i];
				if (relationConnector.diagram2 === toEntity || relationConnector.diagram1 === toEntity) {
					flag = i;
					break;
				}
			}
			if (flag != -1) {
				ctrl.relationConnectors[flag].destroy();
				ctrl.relationConnectors.splice(flag, 1);
			}
		};

		ctrl.addConnectors = function (connector) {
			ctrl.connectors.push(connector);
		};

		ctrl.removeConnectors = function (index) {
			var connector = ctrl.connectors[index];
			connector.destroy();
			ctrl.connectors.splice(index, 1);
		};

		/*
		 Context menu
		 */
		ctrl.menuOptions = [
			['Add attribute', function () {
				ctrl.addAttribute();
			}],
			['Add reference', function () {
				ctrl.addReference();
			}],
			null,
			['Rename', function () {
				ctrl.renameModel();
			}],
			null,
			['Remove', function () {
				ctrl.removeModel();
			}]
		];

		ctrl.renameModel = function () {
			ctrl.askForModelName(ctrl.model.name).then(function (newName) {
				if (!ctrl.onRename({name: newName}) && ctrl.model.name.toLowerCase() !== newName.toLowerCase()) {
					return alert('The name already exists in the database.');
				}
				ctrl.model.rename(newName);
			});
		};

		ctrl.removeModel = function () {
			ctrl.connectors.forEach(function (e) {
				e.destroy();
			});
			ctrl.onDestroy(ctrl.model);
		};

		/*
		 Click title handler: show references
		 */
		ctrl.showDetail = function () {
			ctrl.viewReferenceDetails(ctrl.model.references);
		};

		/*
		 Attributes related
		 */
		ctrl.addAttribute = function () {
			ctrl.addNewAttributeModal().then(function (data) {
				var newAttr = ctrl.model.addAttribute(data);
				if (!newAttr) {
					return alert('The attribute name already exists in this relationship');
				}
				ctrl.addConnectors(new Connector(ctrl.model, newAttr));
			});
		};

		ctrl.addReference = function () {
			ctrl.onAddReference().then(function (data) {
				if (ctrl.model.isDuplicateReferenceName(data.name)) {
					return alert('The reference name already exists in this relationship');
				}

				var res = ctrl.model.addReference(ctrl, data);
				if (!res) {
					return alert('This reference already exists in this relationship');
				}
				// then connect entity with this relationship
				ctrl.addRelationConnectors(data.entity);
			});
		};

		ctrl.isUniqueReference = function (reference) {
			var res = ctrl.model.references.some(function (ref) {
				if (ref !== reference && ref.from.entity === reference.from.entity) {
					return true;
				}
			});
			return !res;
		};

		ctrl.checkAndRemoveConnector = function(reference) {
			if (ctrl.isUniqueReference(reference)) {
				ctrl.removeRelationConnectors(reference.from.entity);
			}
		}

		// handler for remove reference when cascading
		ctrl.removeReference = function (reference) {
			// first, if this is the only reference to that entity, we will remove the relation connector
			// next, remove it from the relationship model
			ctrl.checkAndRemoveConnector(reference);
			// remove it from both attribute and relationship
			reference.from.attribute.removeReference(reference);
			ctrl.model.removeReference(reference);
		};

		// handler for remove reference when cascading
		ctrl.onRemoveReference = function (reference) {
			// first, if this is the only reference to that entity, we will remove the relation connector
			// next, remove it from the relationship model
			ctrl.checkAndRemoveConnector(reference);
			ctrl.model.removeReference(reference); // remove it from the array
		};

		/**
		 * Edit an attribute
		 * @param index array index of the attribute
		 */
		ctrl.editAttribute = function (index) {
			ctrl.editAttributeModal(ctrl.model.getAttribute(index)).then(function (data) {
				var res = ctrl.model.editAttribute(index, data);
				if (!res) {
					return alert('The attribute name already exists in this relationship');
				}
				ctrl.redrawConnectors();
			});
		};

		ctrl.removeAttribute = function (index) {
			ctrl.removeConnectors(index);
			ctrl.model.removeAttribute(index);
		};

		ctrl.renameRelationship = function () {
			ctrl.askForModelName(ctrl.model.name).then(function (newName) {
				ctrl.model.rename(newName);
			});
		};

		/*
		 Modals related
		 */
		ctrl.askForModelName = function (currentName) {
			var newScope = $scope.$new(true);
			newScope.data = currentName;
			var modalInstance = $uibModal.open({
				templateUrl: 'input-prompt.html',
				controller: 'PromptModalCtrl',
				size: 'lg',
				scope: newScope,
				resolve: {
					title: function () {
						return 'Please enter new relationship name';
					}
				}
			});

			return modalInstance.result; // return the promise
		};

		ctrl.addNewAttributeModal = function () {
			var modalInstance = $uibModal.open({
				templateUrl: 'new-attribute-prompt.html',
				controller: 'AttributeModalCtrl',
				size: 'lg',
				resolve: {
					title: function () {
						return 'Create new attribute';
					}
				}
			});

			return modalInstance.result; // return the promise
		};

		/**
		 *
		 * @param attribute the Attribute model
		 * @returns {*}
		 */
		ctrl.editAttributeModal = function (attribute) {
			// create a scope for the modal that contains attribute data
			var newScope = $scope.$new(true);
			newScope.attributeData = {
				name: attribute.name,
				type: attribute.type,
				notNull: attribute.notNull,
				isPrimaryKey: attribute.isPrimaryKey,
				isForeignKey: attribute.isForeignKey
			};

			var modalInstance = $uibModal.open({
				templateUrl: 'new-attribute-prompt.html',
				controller: 'AttributeModalCtrl',
				size: 'lg',
				scope: newScope, // pass the scope created
				resolve: {
					title: function () {
						return 'Edit attribute';
					}
				}
			});

			return modalInstance.result; // return the promise
		};

		ctrl.viewReferenceDetails = function (references) {
			var modalInstance = $uibModal.open({
				templateUrl: 'reference-detail.html',
				controller: 'ViewDetailModalCtrl',
				size: 'lg',
				resolve: {
					title: function () {
						return 'All References (foreign keys) in this relationship';
					},
					references: function () {
						return references;
					},
					onEditReference: function() {
						return ctrl.onEditReference;
					}
				}
			});

			return modalInstance.result; // return the promise
		}
	}

	angular.module('editor').component('erRelationship', {
		bindings: {
			model: '<',
			needsLoadAttribute: '<',
			toAddReferences: '<',
			onDestroy: '&',
			onAddReference: '&',
			onRename: '&',
			onEditReference: '&'
		},
		templateUrl: './app/components/editor/diagram/erRelationship.html',
		controller: RelationshipController
	});
})(window.angular);