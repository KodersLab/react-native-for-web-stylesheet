import newClassName from './newClassName';
import isEqual from 'lodash.isequal';

// storage
export var classesStore = {};
var isStoreLocked = false;

// switch locking of the classNames store
export function lock(){
	isStoreLocked = true;
}

export function unlock(){
	isStoreLocked = false;
}

// put or pick properties
export function put(propertyName, value){
	// does it already exists? if so, return
	var item = find(propertyName, value);
	if(!item) return item;
	// if store is locked, do not allow insertion
	if(isStoreLocked) return null;
	// ensure the property it's created and exists
	classesStore[propertyName] = classesStore[propertyName] || {};
	// assing the className as a key, and as value the actual value
	classesStore[propertyName][newClassName()] = value;
	// return the just assigned item
	return item;
}

// get the className for given propertyName and value, or null if not found
export function find(propertyName, value){
	// attempt to find the className
	var classNames = Object.keys(classesStore[propertyName] || {}).filter(className => isEqual(classesStore[propertyName][className], value));
	return classNames.length > 0 ? classNames[0] : null;
}

export function process(mergedStyle){
	// get merged style keys
	var style = {};
	var classNames = [];
	// attempt to find classNames where possible
	Object.keys(mergedStyle).map(propertyName => {
		var value = mergedStyle[propertyName];
		// does the class already exists?
		var className = find(propertyName, value);
		// if a class name exists, apply it
		if(className){
			classNames.push(className);
		// if no class name exists, then fall back over inline property
		}else{
			style[propertyName] = value;
		}
	});
	// return the value
	return {
		classNames,
		style
	};
}