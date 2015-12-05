'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.subscribe = subscribe;
exports.create = create;
exports.renderToString = renderToString;
exports.renderToStyleNode = renderToStyleNode;
exports.resolve = resolve;
exports.styleForFlex = styleForFlex;
exports.styleForInline = styleForInline;

var _storage = require('./storage');

var _utils = require('./utils');

var _compiler = require('./compiler');

var flexClassName = '__flex';
var inlineClassName = '__inline';

var listeners = [];

function subscribe(fn) {
	listeners.push(fn);
	var isSubscribed = true;

	return function unsubscribe() {
		if (!isSubscribed) return;

		isSubscribed = false;
		var idx = listeners.indexOf(fn);
		listeners.splice(idx, 1);
	};
}

function create(styleSheet) {
	var styleSheetIds = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	Object.keys(styleSheet).forEach(function (className) {
		var classRules = (0, _utils.destruct)(styleSheet[className]);

		Object.keys(classRules).forEach(function (propName) {

			var propValue = classRules[propName];
			var classId = (styleSheetIds[className] || {})[propName];

			if (classId) (0, _storage.put)(propName, propValue, classId);
		});
	});

	return styleSheet;
}

function renderToString() {
	return Object.keys(_storage.storage).map(function (propName) {
		return Object.keys(_storage.storage[propName]).map(function (classId) {
			classId = parseInt(classId, 10);
			return (0, _compiler.ruleFor)(classId, propName, _storage.storage[propName][classId]);
		});
	}).reduce(function (rules, rule) {
		return rules.concat(rule);
	}, []).join(' ');
}

function renderToStyleNode(styleNode) {
	styleNode.textContent = renderToString();
}

function resolve(styles, changeStyle, changeClassNames) {
	var style = {},
	    classNames = [],
	    mergedStyle,
	    propValue,
	    classId;
	mergedStyle = (0, _utils.toArray)(styles).filter(function (style) {
		return !!style;
	}).reduce(function (merged, style) {
		return _extends({}, merged, style);
	}, {});

	if (changeStyle) mergedStyle = changeStyle(mergedStyle);

	mergedStyle = (0, _utils.destruct)(mergedStyle);

	Object.keys(mergedStyle).forEach(function (propName) {
		propValue = mergedStyle[propName];
		classId = (0, _storage.pick)(propName, propValue);

		if (classId) {
			classNames.push((0, _compiler.classNameFor)(classId, propName, propValue));
		} else {
			style[propName] = propValue;
		}
	});

	if (changeClassNames) classNames = changeClassNames(classNames);
	style = (0, _compiler.browserify)(style);

	return {
		style: style,
		className: classNames.join(' ')
	};
}

function styleForFlex(styles, changeStyle) {
	return resolve(styles, changeStyle, function (classNames) {
		return [flexClassName].concat(classNames);
	});
}

function styleForInline(styles, changeStyle) {
	return resolve(styles, changeStyle, function (classNames) {
		return [inlineClassName].concat(classNames);
	});
}

exports.default = {
	create: create
};