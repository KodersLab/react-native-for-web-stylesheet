'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _storageMemory = require('./storage/memory');

var _storageMemory2 = _interopRequireDefault(_storageMemory);

var _styleResolveMultiProperties = require('./style/resolveMultiProperties');

var _styleResolveMultiProperties2 = _interopRequireDefault(_styleResolveMultiProperties);

var _styleToStylesArray = require('./style/toStylesArray');

var _styleToStylesArray2 = _interopRequireDefault(_styleToStylesArray);

var _styleToCSS = require('./style/toCSS');

var _styleToCSS2 = _interopRequireDefault(_styleToCSS);

// counter for classNameId is global to avoid collisions
var lastClassNameId = 0;

// an helper function which takes a new id and then increments
function newClassNameId() {
	lastClassNameId++;
	return lastClassNameId;
}

// the StyleSheet which should be instanciated

var StyleSheet = (function () {
	function StyleSheet() {
		_classCallCheck(this, StyleSheet);

		// create the store to be used
		this._listeners = [];
		this._overrides = {};
		this._store = new _storageMemory2['default']();

		this._blockElementClassNameId = newClassNameId();
		this._inlineElementClassNameId = newClassNameId();
	}

	// given property name and value, returns the class name

	_createClass(StyleSheet, [{
		key: '_classNameFor',
		value: function _classNameFor(classNameId, propertyName, value) {
			// if not, provide a short class name
			return '_' + parseInt(classNameId, 10).toString(36);
		}

		// subscribe to a stylesheet changed
	}, {
		key: 'subscribe',
		value: function subscribe(fn) {
			var _this = this;

			this._listeners.push(fn);
			var isListening = true;

			return function () {
				if (!isListening) return;

				isListening = false;
				var idx = _this._listeners.indexOf(fn);
				_this._listeners.splice(idx, 1);
			};
		}
	}, {
		key: 'override',
		value: function override(propertyName, cssCodeFn) {
			this._overrides[propertyName] = cssCodeFn; // (classNameId, value) => cssCode
		}
	}, {
		key: 'create',
		value: function create(styles) {
			// loop through definitions
			for (var styleName in styles) {
				if (!styles.hasOwnProperty(styleName)) continue;

				// deconstruct and cache deconstructed if possible
				var style = (0, _styleResolveMultiProperties2['default'])(styles[styleName]);

				// continue looping
				for (var propertyName in style) {
					if (!style.hasOwnProperty(propertyName)) continue;

					// ...then store it!
					this._store.put(newClassNameId(), propertyName, style[propertyName]);
				}
			}

			// emit that the stylesheet changed
			this._listeners.slice().forEach(function (listener) {
				return listener();
			});

			// return anyway the styles
			return styles;
		}
	}, {
		key: 'resolve',
		value: function resolve(styles) {
			var _this2 = this;

			var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			// decode options
			var _options$isBlockElement = options.isBlockElement;
			var isBlockElement = _options$isBlockElement === undefined ? true : _options$isBlockElement;
			var modifyMergedStyle = options.modifyMergedStyle;
			var modifyClassNameIds = options.modifyClassNameIds;

			// attempt to merge given styles
			var mergedStyle = (0, _styleToStylesArray2['default'])(styles).reduce(function (mergedStyle, style) {
				return _extends({}, mergedStyle, style);
			}, {});

			// call the user defined modifyMergedStyle
			if (modifyMergedStyle) mergedStyle = modifyMergedStyle(mergedStyle);

			// deconstruct multi properties to their specific counterparts
			mergedStyle = (0, _styleResolveMultiProperties2['default'])(mergedStyle);

			// get class ids
			var style = {};
			var classNames = {};
			Object.keys(mergedStyle).forEach(function (propertyName) {
				// attempt to get the classNameId
				var value = mergedStyle[propertyName];
				var classNameId = _this2._store.pick(propertyName, value);
				// if it is not found, fall back to an inline style.
				if (classNameId === null) {
					style[propertyName] = value;
					// or return the className
				} else {
						classNames[classNameId] = { propertyName: propertyName, value: value };
					}
			});

			// if isBlockElement or isInlineElement, append the block element class
			if (isBlockElement) {
				classNames[this._blockElementClassNameId] = {};
			} else {
				classNames[this._inlineElementClassNameId] = {};
			}

			// call the user defined modifyClassNames
			if (modifyClassNameIds) classNames = modifyClassNameIds(classNames);

			// get the actual classNames
			classNames = Object.keys(classNames).map(function (classNameId) {
				return _this2._classNameFor(classNameId, classNames[classNameId].propertyName, classNames[classNameId].value);
			});

			// returns the className and the style object
			return {
				className: classNames.join(' '),
				style: style
			};
		}
	}, {
		key: 'renderToString',
		value: function renderToString() {
			var _this3 = this;

			var rules = [];

			// prepend the inline and the block element classes
			var blockElementClassName = this._classNameFor(this._blockElementClassNameId);
			var inlineElementClassName = this._classNameFor(this._inlineElementClassNameId);

			// push to the rules
			rules.push('\n\t\thtml, body, #app{\n\t\t\tmargin: 0;\n\t\t\tpadding: 0;\n\t\t\t\n\t\t\tfont-family: Helvetica;\n\t\t\tfont-size: 14px;\n\t\t\tfont-weight: 100;\n\t\t\t\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tdisplay: flex;\n\t\t\tflex-direction: column;\n\t\t\toverflow: hidden;\n\t\t}\n\t\t\n\t\t.' + blockElementClassName + '{\n\t\t\tbox-sizing: border-box;\n\t\t\tposition: relative;\n\t\t\tborder: 0 solid black;\n\t\t\tmargin: 0;\n\t\t\tpadding: 0;\n\t\t\tdisplay: flex;\n\t\t\tflex-direction: column;\n\t\t\talign-items: stretch;\n\t\t\tjustify-content: flex-start;\n\t\t\tflex: 0 0 auto;\n\t\t\t\n\t\t\tbackground-color: transparent;\n\t\t\tcolor: inherit;\n\t\t\tfont: inherit;\n\t\t\ttext-align: inherit;\n\t\t}\n\t\t.' + inlineElementClassName + '{display: inline-block}\n\t\t');

			// get the current dump
			var storage = this._store.dump();

			// compile to a CSS string
			Object.keys(storage).forEach(function (propertyName) {
				Object.keys(storage[propertyName]).forEach(function (classNameId) {
					var value = storage[propertyName][classNameId];
					var className = _this3._classNameFor(classNameId, propertyName, value);

					if (typeof _this3._overrides[propertyName] !== 'undefined') {
						rules.push(_this3._overrides[propertyName](className, classNameId, value));
					} else {
						rules.push('.' + className + '{' + (0, _styleToCSS2['default'])(propertyName, value) + '}');
					}
				});
			});

			return rules.join(' ');
		}
	}, {
		key: 'renderToStyleTag',
		value: function renderToStyleTag(styleNode) {
			// render the string of the stylesheet to the style tag
			styleNode.textContent = this.renderToString();
		}
	}]);

	return StyleSheet;
})();

exports['default'] = StyleSheet;
module.exports = exports['default'];