(function (angular) {
	'use strict';

	function editorManager() {
		var manager = {};

		var entities = [];
		var relationships = [];

		manager.createEntity = function (name) {
			var entity = new Entity(name);
			entities.push(entity);
			return entity;
		};

		manager.createRelationship = function (name) {
			var relationship = new Relationship(name);
			relationships.push(entity);
			return relationship;
		};

		manager.generateSchemaData = function () {
			var data = {
				entities: []
			};
			entities.forEach(function (entity) {
				data.entities.push(entity.summarize());
			});

			return data;
		};

		return manager;
	}


	angular.module('myApp.services').factory('editorManager', editorManager);
})(window.angular);