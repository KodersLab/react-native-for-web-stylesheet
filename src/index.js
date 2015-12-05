import {pick, put, storage} from './storage';
import {toArray, destruct} from './utils';
import {classNameFor, ruleFor, browserify} from './compiler';

var flexClassName = '__flex';
var inlineClassName = '__inline';

var listeners = [];

export function subscribe(fn){
	listeners.push(fn);
	var isSubscribed = true;
	
	return function unsubscribe(){
		if(!isSubscribed) return;
		
		isSubscribed = false;
		var idx = listeners.indexOf(fn);
		listeners.splice(idx, 1);
	};
}

export function create(styleSheet, styleSheetIds = {}){
	Object.keys(styleSheet).forEach(className => {
		var classRules = destruct(styleSheet[className]);
		
		Object.keys(classRules).forEach(propName => {
			
			var propValue = classRules[propName];
			var classId = (styleSheetIds[className] || {})[propName];
			
			if(classId) put(propName, propValue, classId);
		})
	});
	
	return styleSheet;
}


export function renderToString(){
	return Object.keys(storage)
		.map(propName => 
			Object.keys(storage[propName])
				.map(classId => {
					classId = parseInt(classId, 10);
					return ruleFor(classId, propName, storage[propName][classId]);
				})
		)
		.reduce((rules, rule) => rules.concat(rule), [])
		.join(' ');
}

export function renderToStyleNode(styleNode){
	styleNode.textContent = renderToString();
}

export function resolve(styles, changeStyle, changeClassNames){
	var style = {}, classNames = [], mergedStyle, propValue, classId;
	mergedStyle = toArray(styles)
		.filter(style => !!style)
		.reduce((merged, style) => ({...merged, ...style}), {});
		
	if(changeStyle) mergedStyle = changeStyle(mergedStyle);
	
	mergedStyle = destruct(mergedStyle);
	
	Object.keys(mergedStyle)
		.forEach(propName => {
			propValue = mergedStyle[propName];
			classId = pick(propName, propValue);
			
			if(classId){
				classNames.push(classNameFor(classId, propName, propValue));
			}else{
				style[propName] = propValue;
			}
		});
		
	if(changeClassNames) classNames = changeClassNames(classNames);
	style = browserify(style);
	
	return {
		style,
		className: classNames.join(' ')
	}
}

export function styleForFlex(styles, changeStyle){
	return resolve(styles, changeStyle, (classNames) => [flexClassName].concat(classNames));
}

export function styleForInline(styles, changeStyle){
	return resolve(styles, changeStyle, (classNames) => [inlineClassName].concat(classNames));	
}

export default {
	create
}