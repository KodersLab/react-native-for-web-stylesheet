'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (_ref) {
	var t = _ref.types;

	var isStyleSheetCall = t.buildMatchMemberExpression('StyleSheet.create');
	function isStyleSheetCreateCall(node) {
		return t.isMemberExpression(node) && isStyleSheetCall(node);
	}

	function getClassNodes(styleSheetNode) {
		// if this is not an object, skip
		if (!t.isObjectExpression(styleSheetNode)) return [];

		// loop through defined classes
		return styleSheetNode.properties.map(function (classNode) {
			// key is not an identifier and value is not an object expression, skip class def
			if (!t.isIdentifier(classNode.key) || !t.isObjectExpression(classNode.value)) {
				return;
			}

			// this is a valid class node
			return classNode;
		}).filter(function (classNode) {
			return !!classNode;
		});
	}

	function getPropertyNodes(classNode) {
		// if this is not an object, skip
		if (!t.isObjectExpression(classNode)) return [];

		// loop through defined classes
		return classNode.properties.map(function (propertyNode) {
			// key is not an identifier and value is not an object expression, skip class def
			if (!t.isIdentifier(propertyNode.key)) {
				return;
			}

			if (!(t.isStringLiteral(propertyNode.value) || t.isNumericLiteral(propertyNode.value))) {
				return;
			}

			// this is a valid class node
			return propertyNode;
		}).filter(function (propertyNode) {
			return !!propertyNode;
		});
	}

	function astify(value) {
		switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
			case 'string':
				return t.stringLiteral(value);
			case 'number':
				return t.numericLiteral(value);
			default:
				if (Array.isArray(value)) {
					return t.arrayExpression(value.map(astify));
				}

				return t.objectExpression(Object.keys(value).filter(function (key) {
					return typeof value[key] !== 'undefined';
				}).map(function (key) {
					return t.objectProperty(t.identifier(key), astify(value[key]));
				}));
		}
	}

	return {
		visitor: {
			CallExpression: function CallExpression(path) {
				var callee = path.node.callee;
				var sheetStore = {};

				// is a StyleSheet.create call?
				if (isStyleSheetCreateCall(callee)) {
					var args = path.node.arguments;

					// not enough arguments
					if (!args.length) return;

					// forEach styleSheet class
					getClassNodes(args[0]).forEach(function (classNode) {
						var className = classNode.key.name;
						var style = {};
						sheetStore[className] = {};

						getPropertyNodes(classNode.value).forEach(function (propertyNode) {
							var propName = propertyNode.key.name;
							var propValue = propertyNode.value.value;

							style[propName] = propValue;
						});

						style = (0, _utils.destruct)(style);

						Object.keys(style).forEach(function (propName) {
							var propValue = style[propName];

							(0, _storage.put)(propName, propValue);
							var classId = (0, _storage.pick)(propName, propValue);
							sheetStore[className][propName] = classId;
						});
					});

					// push dumped store into args
					path.node.arguments.push(astify(sheetStore));
				}
			}
		}
	};
};

var _storage = require('../storage');

var _utils = require('../utils');

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }