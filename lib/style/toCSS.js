'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dataUnitlessProperties = require('../data/unitlessProperties');

var _dataUnitlessProperties2 = _interopRequireDefault(_dataUnitlessProperties);

exports['default'] = function (propertyName, value) {
	return propertyName.replace(/([A-Z])/g, '-$1').toLowerCase() + ':' + (typeof value === 'number' && typeof _dataUnitlessProperties2['default'][propertyName] === 'undefined' ? value + 'px' : value);
};

module.exports = exports['default'];