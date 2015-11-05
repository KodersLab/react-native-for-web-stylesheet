'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = resolveMultiProperties;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _dataMultiProperties = require('../data/multiProperties');

var _dataMultiProperties2 = _interopRequireDefault(_dataMultiProperties);

function resolveMultiProperties(style) {
	// first omit the multi props from the style
	var newStyle = {};
	Object.keys(style).filter(function (propertyName) {
		return typeof _dataMultiProperties2['default'][propertyName] === 'undefined';
	}).forEach(function (propertyName) {
		return newStyle[propertyName] = style[propertyName];
	});

	// then merge with the current style
	return Object.keys(_dataMultiProperties2['default']).filter(function (propertyName) {
		return typeof style[propertyName] !== 'undefined';
	}).reduce(function (newStyle, propertyName) {
		// stores the value
		var value = style[propertyName];

		return _extends({}, _dataMultiProperties2['default'][propertyName].reduce(function (rules, aliasPropertyName) {
			return _extends({}, rules, _defineProperty({}, aliasPropertyName, value));
		}, {}), newStyle);
	}, newStyle);
}

module.exports = exports['default'];

// an object with keys as the multi prop translation

// the previous style