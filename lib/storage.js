'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.storage = undefined;
exports.pick = pick;
exports.put = put;

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nextClassId = 0;
var storage = exports.storage = {};

// get the classId
function pick(propName, propValue) {
	var possibleClassIds = Object.keys(storage[propName] || {}).filter(function (classId) {
		return (0, _lodash2.default)(storage[propName][classId], propValue);
	});

	return possibleClassIds.length > 0 ? parseInt(possibleClassIds[0], 10) : null;
}

// sets the classId
function put(propName, propValue, classId) {
	if (pick(propName, propValue)) return false;

	if (!classId) {
		nextClassId++;
		classId = nextClassId;
	}

	nextClassId = nextClassId < classId ? classId : nextClassId;

	storage[propName] = storage[propName] || {};
	storage[propName][classId] = propValue;

	return true;
}