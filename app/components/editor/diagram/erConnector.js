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
	this.dom.parentNode.removeChild(this.dom);
}