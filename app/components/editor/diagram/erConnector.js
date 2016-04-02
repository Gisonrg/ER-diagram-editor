/**
 To represent the connector model
 e.g. the line connects Entity and Attribute
 */

/**
 *
 * @param element1 Entity|Relationship
 * @param element2 Attribute
 * @constructor
 */
function Connector(entity, attribute) {
	this.fromModel = entity;
	this.attributeModel = attribute;
	this.fromModel.addConnectors(this);
	this.attributeModel.addConnectors(this);

	var svg = document.getElementById('editor-canvas'); //Get svg element
	var path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); //Create a path in SVG's namespace
	path.style.stroke = 'black'; //Set stroke colour
	path.style.strokeWidth = '1px'; //Set stroke width
	svg.appendChild(path);
	this.dom = path;
	this.dom.setAttribute('name', 'attr connector from ' + this.fromModel.name + ' to ' + this.attributeModel.name);
}

Connector.prototype.redraw = function () {
	var elementWidth = 100 / 2;
	var elementHeight = 28 / 2;

	var width = this.fromModel.dom.width(),
		height = this.fromModel.dom.height();
	// for drawing
	var fromPosition = this.fromModel.dom.position();
	var attributePosition = this.attributeModel.dom.position();
	var fromX = Math.round(fromPosition.left + width / 2);
	var fromY = Math.round(fromPosition.top + height / 2);
	var toX = Math.round(fromPosition.left + elementWidth + attributePosition.left);
	var toY = Math.round(fromPosition.top + elementHeight + attributePosition.top);
	this.dom.setAttribute('d', 'M ' + fromX + ' ' + fromY + ' L ' + toX + ' ' + toY + ' Z');
}

Connector.prototype.destroy = function () {
	this.fromModel.removeConnectors(this);
	this.attributeModel.removeConnectors(this);
	if (this.dom.parentNode) {
		this.dom.parentNode.removeChild(this.dom);
	}
}

/**
 *
 * @param {Entity|Relationship} diagram1
 * @param {Entity|Relationship} diagram2
 * @constructor
 */
function RelationConnector(diagram1, diagram2) {
	this.diagram1 = diagram1;
	this.diagram2 = diagram2;

	this.diagram1.addRelationConnector(this);
	this.diagram2.addRelationConnector(this);

	var svg = document.getElementById('editor-canvas'); //Get svg element
	var path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); //Create a path in SVG's namespace
	path.style.stroke = 'black'; //Set stroke colour
	path.style.strokeWidth = '1px'; //Set stroke width
	svg.appendChild(path);
	this.dom = path;
	this.dom.setAttribute('name', 'relation connector from ' + this.diagram1.name + ' to ' + this.diagram2.name);
}

RelationConnector.prototype.redraw = function () {
	var fromWidth = this.diagram1.dom.width(),
		fromHeight = this.diagram1.dom.height();
	var toWidth = this.diagram2.dom.width(),
		toHeight = this.diagram2.dom.height();
	// for drawing
	var fromPosition = this.diagram1.dom.position();
	var toPosition = this.diagram2.dom.position();
	var fromX = Math.round(fromPosition.left + fromWidth / 2);
	var fromY = Math.round(fromPosition.top + fromHeight / 2);
	var toX = Math.round(toPosition.left + toWidth / 2);
	var toY = Math.round(toPosition.top + toHeight / 2);
	this.dom.setAttribute('d', 'M ' + fromX + ' ' + fromY + ' L ' + toX + ' ' + toY + ' Z');
}

RelationConnector.prototype.destroy = function () {
	this.diagram1.removeRelationConnector(this);
	this.diagram2.removeRelationConnector(this);
	if (this.dom.parentNode) {
		this.dom.parentNode.removeChild(this.dom);
	}
}