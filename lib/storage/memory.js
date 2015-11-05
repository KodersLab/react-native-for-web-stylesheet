'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _lodashIsequal = require('lodash.isequal');

var _lodashIsequal2 = _interopRequireDefault(_lodashIsequal);

var MemoryStorage = (function (_BaseStorage) {
	_inherits(MemoryStorage, _BaseStorage);

	function MemoryStorage(options) {
		_classCallCheck(this, MemoryStorage);

		_get(Object.getPrototypeOf(MemoryStorage.prototype), 'constructor', this).call(this);
		// store the classNameIds in a object
		this.storage = {};
	}

	_createClass(MemoryStorage, [{
		key: 'pick',
		value: function pick(propertyName, value) {
			var _this = this;

			// lookup in every sub-object value and return its key
			var possibleClassNameIds = Object.keys(this.storage[propertyName] || {}).filter(function (classNameId) {
				return (0, _lodashIsequal2['default'])(_this.storage[propertyName][classNameId], value);
			});
			// return the classNameId or null if none is found
			return possibleClassNameIds.length > 0 ? possibleClassNameIds[0] : null;
		}
	}, {
		key: 'put',
		value: function put(classNameId, propertyName, value) {
			// if already stored, return
			if (this.pick(propertyName, value) !== null) return;
			// if not stored, create the record
			this.storage[propertyName] = this.storage[propertyName] || {};
			// put the classNameId and the propertyName and value
			this.storage[propertyName][classNameId] = value;
		}
	}, {
		key: 'dump',
		value: function dump() {
			return this.storage;
		}
	}, {
		key: 'shutdown',
		value: function shutdown() {
			// destroy the object so it can be gc
			this.storage = null;
		}
	}]);

	return MemoryStorage;
})(_base2['default']);

exports['default'] = MemoryStorage;
module.exports = exports['default'];