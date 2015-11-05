"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = toStylesArray;

function toStylesArray(styles) {
	// is already an array? return it!
	if (Array.isArray(styles)) return styles;
	// if it is nullish, return empty array
	if (typeof styles === 'undefined' || styles === null) return [];
	// if it is an object with numeric keys, returns its values
	if (typeof styles === "object" && !Object.keys(styles).filter(function (k) {
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

module.exports = exports["default"];