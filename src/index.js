import {pick, put, storage} from './storage';
import {toArray, destruct} from './utils';
import {classNameFor, ruleFor, browserify} from './compiler';

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
		
	if(changeClassNames) changeClassNames(classNames);
	style = browserify(style);
	
	return {
		style,
		className: classNames.join(' ')
	}
}

export function renderToString(){
	return Object.keys(storage)
		.map(propName => 
			Object.keys(storage[propName])
				.map(classId => {
					return ruleFor(parseInt(classId, 10), propName, storage[propName][classId]);
				})
		)
		.reduce((rules, rule) => rules.concat(rule), [])
		.join(' ');
}

export function renderToStyleNode(styleNode){
	styleNode.textContent = renderToString();
}