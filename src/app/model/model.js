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
	this.id = 'entity-' + this.name;
	this.attributes = [];
	this.dom = null;
	this.connectors = [];
	this.relationConnectors = [];
}

Entity.prototype.rename = function(newName) {
	this.name = newName;
	this.id = 'entity-' + this.name;
	this.dom.id = this.id;
};

Entity.prototype.isDuplicateAttributeName = function (name) {
	return this.attributes.some(function(attr) {
		return attr.name.toLowerCase() === name.toLowerCase();
	});
}

Entity.prototype.addAttribute = function (attributeData) {
	// check for duplicate name first
	if (this.isDuplicateAttributeName(attributeData.name)) {
		return false;
	}

	var newAttr = new Attribute(attributeData);
	this.attributes.push(newAttr);
	return newAttr;
};

Entity.prototype.getAttribute = function (index) {
	return this.attributes[index];
};

/**
 *
 * @param index
 * @param attributeData
 * @returns {boolean} if the edit operation succeed or not
 */
Entity.prototype.editAttribute = function (index, attributeData) {
	if (this.attributes[index].name.toLowerCase() === attributeData.name.toLowerCase()) {
		this.attributes[index].updateData(attributeData);
		return true;
	}

	if (this.isDuplicateAttributeName(attributeData.name)) {
		return false;
	}

	this.attributes[index].updateData(attributeData);
	return true;
};

Entity.prototype.removeAttribute = function (index) {
	var attr = this.attributes[index];
	attr.destroy();
	this.attributes.splice(index, 1);
};

Entity.prototype.addConnectors = function (connectors) {
	this.connectors.push(connectors);
};

Entity.prototype.removeConnectors = function (connectors) {
	var idx = this.connectors.indexOf(connectors);
	if (idx === -1) {
		return;
	}
	this.connectors.splice(idx, 1);
};

Entity.prototype.addRelationConnector = function (connector) {
	this.relationConnectors.push(connector);
};

Entity.prototype.removeRelationConnector = function (connector) {
	var idx = this.relationConnectors.indexOf(connector);
	if (idx === -1) {
		return;
	}
	this.relationConnectors.splice(idx, 1);
};

Entity.prototype.destroy = function () {
	this.attributes.forEach(function(e) {
		e.destroy();
	})
	this.attributes = [];
	this.dom[0].parentNode.removeChild(this.dom[0]);
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
			meta.notNull = true;
		}
		if (attribute.isPrimaryKey) {
			primaryKeys.push(attribute.name);
		}
		attributes.push(meta);
	});

	return {
		type: 'entity',
		name: this.name,
		attributes: attributes,
		primaryKey: primaryKeys
	}
};

/**
 * Relationship model
 * @param name
 * @constructor
 */
function Relationship(name) {
	this.name = name;
	this.id = 'relationship-' + this.name;
	this.attributes = [];
	this.dom = null;
	this.connectors = [];
	this.references = [];
	this.relationConnectors = [];
}

Relationship.prototype.rename = function(newName) {
	this.name = newName;
	this.id = 'relationship-' + this.name;
	this.dom.id = this.id;
};

Relationship.prototype.isDuplicateAttributeName = function (name) {
	return this.attributes.some(function(attr) {
		return attr.name.toLowerCase() === name.toLowerCase();
	});
}

Relationship.prototype.isDuplicateReferenceName = function (name) {
	return this.references.some(function(ref) {
		return ref.name.toLowerCase() === name.toLowerCase();
	});
}

Relationship.prototype.isDuplicateReference = function (entity, attribute) {
	return this.references.some(function(ref) {
		return ref.from.entity === entity && ref.from.attribute === attribute;
	});
}

Relationship.prototype.addAttribute = function (attributeData) {
	// check for duplicate name first
	if (this.isDuplicateAttributeName(attributeData.name)) {
		return false;
	}

	var newAttr = new Attribute(attributeData);
	this.attributes.push(newAttr);
	return newAttr;
};

Relationship.prototype.getAttribute = function (index) {
	return this.attributes[index];
};

Relationship.prototype.editAttribute = function (index, attributeData) {
	if (this.attributes[index].name.toLowerCase() === attributeData.name.toLowerCase()) {
		this.attributes[index].updateData(attributeData);
		return true;
	}

	if (this.isDuplicateAttributeName(attributeData.name)) {
		return false;
	}
	this.attributes[index].updateData(attributeData);
	return true;
};

Relationship.prototype.removeAttribute = function (index) {
	// also delete connectors if needed
	this.attributes.splice(index, 1);
};

Relationship.prototype.addReference = function (ctrl, data) {
	// check for duplicate name first
	if (this.isDuplicateReference(data.entity, data.attribute)) {
		return false;
	}
	var reference = new Reference(ctrl, this, data.entity, data.attribute, data.name, data.type, data.isPrimaryKey);
	// add to relationship
	this.references.push(reference);
	// add to referenced attribute
	data.attribute.addReference(reference);
	return reference;
};

Relationship.prototype.removeReference = function (reference) {
	var idx = this.references.indexOf(reference);
	if (idx === -1) {
		return;
	}
	this.references.splice(idx, 1);
};

Relationship.prototype.addConnectors = function (connectors) {
	this.connectors.push(connectors);
};

Relationship.prototype.removeConnectors = function (connectors) {
	var idx = this.connectors.indexOf(connectors);
	if (idx === -1) {
		return;
	}
	this.connectors.splice(idx, 1);
};

Relationship.prototype.addRelationConnector = function (connector) {
	this.relationConnectors.push(connector);
};

Relationship.prototype.removeRelationConnector = function (connector) {
	var idx = this.relationConnectors.indexOf(connector);
	if (idx === -1) {
		return;
	}
	this.relationConnectors.splice(idx, 1);
};

Relationship.prototype.destroy = function () {
	this.attributes.forEach(function(e) {
		e.destroy();
	});
	for (var i = this.references.length - 1; i >= 0; i--) {
		this.references[i].destroy();
	}
	this.attributes = [];
	this.references = [];
	this.dom[0].parentNode.removeChild(this.dom[0]);
};

Relationship.prototype.summarize = function () {
	var attributes = [];
	var primaryKeys = [];
	var foreignKeys = [];
	var linkedEntities = [];
	this.attributes.forEach(function (attribute) {
		var meta = {
			name: attribute.name,
			type: attribute.type.name
		};
		if (attribute.type.hasLength) {
			meta.length = attribute.type.length;
		}
		if (attribute.notNull) {
			meta.notNull = true;
		}
		if (attribute.isPrimaryKey) {
			primaryKeys.push(attribute.name);
		}
		attributes.push(meta);
	});

	this.references.forEach(function (reference) {
		var meta = {
			name: reference.name,
			type: reference.type.name
		};
		if (reference.type.hasLength) {
			meta.length = reference.type.length;
		}
		if (reference.isPrimaryKey) {
			primaryKeys.push(reference.name);
		}

		var foreignKeyMeta = {
			attribute: reference.name,
			reference: {
				source: reference.from.entity.name,
				attribute: reference.from.attribute.name
			}
		};

		if (linkedEntities.indexOf(reference.from.entity.name) === -1) {
			linkedEntities.push(reference.from.entity.name);
		}

		foreignKeys.push(foreignKeyMeta);
		attributes.push(meta);
	});

	return {
		type: 'relationship',
		name: this.name,
		linkedEntities: linkedEntities,
		attributes: attributes,
		primaryKey: primaryKeys,
		foreignKeys: foreignKeys
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
	this.isPrimaryKey = attributeData.isPrimaryKey || false;
	this.isForeignKey = attributeData.isForeignKey || false;
	this.isKey = this.isPrimaryKey || this.isForeignKey;

	this.dom = null;
	this.connectors = [];
	this.references = []; // keep the references
}

Attribute.prototype.updateData = function (attributeData) {
	this.name = attributeData.name;
	this.type = attributeData.type;
	this.notNull = attributeData.notNull;
	this.isPrimaryKey = attributeData.isPrimaryKey || false;
	this.isForeignKey = attributeData.isForeignKey || false;
};

Attribute.prototype.addConnectors = function (connectors) {
	this.connectors.push(connectors);
};

/**
 *
 * @param {Reference} reference
 */
Attribute.prototype.addReference = function (reference) {
	this.references.push(reference);
};

/**
 *
 * @param {Reference} r
 */
Attribute.prototype.removeReference = function(r) {
	var idx = this.references.indexOf(r);
	if (idx == -1) { return; }
	this.references.splice(idx,1);
}

Attribute.prototype.removeConnectors = function (connectors) {
	var idx = this.connectors.indexOf(connectors);
	if (idx === -1) {
		return;
	}
	this.connectors.splice(idx, 1);
};

Attribute.prototype.destroy = function () {
	this.references.forEach(function(ref) {
		// remove it from the owner ctrl and model
		ref.ownerCtrl.onRemoveReference(ref);
	});
	this.references = [];
	this.dom[0].parentNode.removeChild(this.dom[0]);
};

/**
 *
 * Reference model
 * @param ownerCtrl
 * @param {Relationship} owner
 * @param {Entity} fromEntity
 * @param {Attribute} fromAttribute
 * @param {string} name
 * @param {boolean} isPrimaryKey
 * @constructor
 */
function Reference(ownerCtrl, owner, fromEntity, fromAttribute, name, type, isPrimaryKey) {
	this.name = name;
	this.ownerCtrl = ownerCtrl;
	this.owner = owner;
	this.type = type;
	this.from = {};
	this.from.entity = fromEntity;
	this.from.attribute = fromAttribute;
	this.isPrimaryKey = isPrimaryKey;
}

Reference.prototype.destroy = function () {
	this.ownerCtrl.onRemoveReference(this);
};

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