'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _index = require('../index');

var _fs = require('fs');

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

			compiler.plugin("done", function (stats) {
				var css = (0, _index.renderToString)();

				(0, _postcss2.default)([_autoprefixer2.default]).process(css).then(function (result) {
					result.warnings().forEach(function (warn) {
						console.warn(warn.toString());
					});
					(0, _fs.writeFile)(filename, result.css);
				});
			});
		}
	}]);

	return StyleSheetPlugin;
})();

module.exports = StyleSheetPlugin;