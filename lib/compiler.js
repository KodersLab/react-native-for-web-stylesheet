'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.classNameFor = classNameFor;
exports.ruleFor = ruleFor;
exports.browserify = browserify;

var _unitless = require('./data/unitless');

var _unitless2 = _interopRequireDefault(_unitless);

var _storage = require('./storage');

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cssPropName(propName) {
	return propName.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function cssPropValue(propName, propValue) {
	switch (propName.toLowerCase()) {
		default:
			return typeof propValue === 'number' && !_unitless2.default[propName] ? propValue + 'px' : propValue;
	}
}

function classNameFor(classId, propName, propValue) {
	return '_' + classId.toString(36);
}

function ruleFor(classId, propName, propValue) {
	switch (propName) {
		case 'resizeMode':
		case 'tintColor':
			return '';
		default:
			return '.' + classNameFor(classId, propName, propValue) + '{' + cssPropName(propName) + ':' + cssPropValue(propName, propValue) + ';}';
	}
}

function browserify(nativeStyle) {
	var style = {},
	    propValue;

	Object.keys(nativeStyle).forEach(function (propName) {
		propValue = nativeStyle[propName];
		style[propName] = cssPropValue(propName, propValue);
	});

	return style;
}