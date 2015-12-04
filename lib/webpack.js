'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _index = require('./index');

var _fs = require('fs');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StyleSheetPlugin = (function () {
	function StyleSheetPlugin(options) {
		_classCallCheck(this, StyleSheetPlugin);

		this.options = _extends({
			filename: "app.css"
		}, options);
	}

	_createClass(StyleSheetPlugin, [{
		key: 'apply',
		value: function apply(compiler) {
			var filename = this.options.filename;

			compiler.plugin("emit", function (compilation, callback) {
				(0, _fs.writeFile)(filename, (0, _index.renderToString)());
				callback();
			});
		}
	}]);

	return StyleSheetPlugin;
})();

module.exports = StyleSheetPlugin;