"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseStorage = (function () {
	function BaseStorage(options) {
		_classCallCheck(this, BaseStorage);
	}

	_createClass(BaseStorage, [{
		key: "pick",
		value: function pick(propertyName, value) {
			return null;
		}
	}, {
		key: "put",
		value: function put(className, propertyName, value) {}
	}, {
		key: "dump",
		value: function dump() {
			return {};
		}
	}, {
		key: "shutdown",
		value: function shutdown() {}
	}]);

	return BaseStorage;
})();

exports["default"] = BaseStorage;
module.exports = exports["default"];