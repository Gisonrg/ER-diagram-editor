(function (angular) {
	'use strict';
	angular.module('myApp.model', []);

	angular.module('myApp.model')
		.constant('DataType', [
			new DataType('INTEGER'),
			new DataType('NUMERIC'),
			new DataType('VARCHAR', 128),
			new DataType('TEXT'),
			new DataType('DATE'),
			new DataType('TIMESTAMP')
		]);
})(window.angular);

/**
 * Models shared globally
 */

/**
 * Entity model
 * @param name
 * @constructor
 */
function Entity(name) {
	this.name = name;
	this.attributes = [];
}

Entity.prototype.addAttribute = function (attributeData) {
	this.attributes.push(new Attribute(attributeData));
};

Entity.prototype.summarize = function () {
	var attributes = [];
	var primaryKeys = [];
	this.attributes.forEach(function (attribute) {
		var meta = {
			name: attribute.name,
			type: attribute.type.name
		};
		if (attribute.type.hasLength) {
			meta.length = attribute.type.length;
		}
		if (attribute.notNull) {
			meta.notNull = 'true';
		}
		if (attribute.isPrimaryKey) {
			primaryKeys.push(attribute.name);
		}
		attributes.push(meta);
	});

	return {
		name: this.name,
		attributes: attributes,
		primaryKey: primaryKeys
	}
};

/**
 * Attribute model
 * @param attributeData
 * @constructor
 */
function Attribute(attributeData) {
	this.name = attributeData.name;
	this.type = attributeData.type;
	this.notNull = attributeData.notNull;
	this.isPrimaryKey = attributeData.isPrimaryKey;
	this.isForeignKey = attributeData.isForeignKey;
	this.isKey = this.isPrimaryKey || this.isForeignKey;
}

/**
 * DataType model
 * @param name
 * @param length
 * @constructor
 */
function DataType(name, length) {
	this.name = name;
	this.length = length || 0;
	this.hasLength = this.length !== 0 || false;
}