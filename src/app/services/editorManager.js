(function (angular) {
	'use strict';

	function Entity(name) {
		this.name = name;
		this.attributes = [];
	}

	Entity.prototype.addAttribute = function (attributeData) {
		this.attributes.push(new Attribute(attributeData));
	};

	Entity.prototype.summarize = function () {
		var attributes = [];
		this.attributes.forEach(function (attribute) {
			attributes.push({
				name: attribute.name,
				type: attribute.type
			});
		});

		return {
			name: this.name,
			attributes: attributes
		}
	};

	function Attribute(attributeData) {
		this.name = attributeData.name;
		this.type = attributeData.type;
	}


	function editorManager() {
		var manager = {};

		var entities = [];
		var relationships = [];

		manager.createEntity = function (name) {
			var entity = new Entity(name);
			entities.push(entity);
			return entity;
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