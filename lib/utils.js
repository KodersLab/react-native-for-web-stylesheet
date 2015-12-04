"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.destruct = destruct;
exports.toArray = toArray;

var _multi = require("./data/multi");

var _multi2 = _interopRequireDefault(_multi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function destruct(mergedStyle) {
	// first omit the multi props from the style
	var style = {};
	Object.keys(mergedStyle).filter(function (propName) {
		return _multi2.default[propName] === undefined;
	}).forEach(function (propName) {
		return style[propName] = mergedStyle[propName];
	});

	// then merge with the current style
	return Object.keys(_multi2.default).filter(function (propName) {
		return mergedStyle[propName] !== undefined;
	}).reduce(function (style, propName) {
		// stores the value
		var propValue = mergedStyle[propName];

		return _extends({}, _multi2.default[propName].reduce(function (rules, aliasPropName) {
			return _extends({}, rules, _defineProperty({}, aliasPropName, propValue));
		}, {}), style);
	}, style);
}

function toArray(styles) {
	// is already an array? return it!
	if (Array.isArray(styles)) return styles;
	// if it is nullish, return empty array
	if (!styles) return [];
	// if it is an object with numeric keys, returns its values
	if ((typeof styles === "undefined" ? "undefined" : _typeof(styles)) === "object" && !Object.keys(styles).filter(function (k) {
		return (/$[0-9]*/.test(k)
		);
	}).length) {
		return Object.keys(styles).map(function (k) {
			return styles[k];
		});
	}
	// just wrap in an array the current styles
	return [styles];
}