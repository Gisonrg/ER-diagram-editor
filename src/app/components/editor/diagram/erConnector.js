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
}

Connector.prototype.redraw = function () {
	var elementWidth = 100 / 2;
	var elementHeight = 28 / 2;

	var width = this.fromModel.dom.width(),
		height = this.fromModel.dom.height(),
		containerLeftOffset = angular.element('.editor-container').offset().left;

	// for drawing
	var fromX = Math.round(this.fromModel.dom.position().left + width / 2);
	var fromY = Math.round(this.fromModel.dom.position().top + height / 2);
	var toX = Math.round(this.attributeModel.dom.offset().left + elementWidth - containerLeftOffset);
	var toY = Math.round(this.attributeModel.dom.offset().top + elementHeight);

	this.dom.setAttribute('d', 'M ' + fromX + ' ' + fromY + ' L ' + toX + ' ' + toY + ' Z');
}

Connector.prototype.destroy = function () {
	this.fromModel.removeConnectors(this);
	this.attributeModel.removeConnectors(this);
	this.dom.parentNode.removeChild(this.dom);
}