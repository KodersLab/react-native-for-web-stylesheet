import classNameGenerator from './utils/classNameGenerator';
import isEqual from 'lodash.isequal';

// storage and classNameGenerator
var newClassName = classNameGenerator();
export var classesStore = {};
var isStoreLocked = true;

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
	if(isStoreLocked) return;
	// ensure the property it's created and exists
	classesStore[propertyName] = classesStore[propertyName] || [];
	// prepare the item to store
	item = {
		value,
		className: newClassName()
	};
	// assing the value as a key, and as value generate a new className
	classesStore[propertyName].push(item);
	// return the just assigned item
	return item;
}

// get the store item for given propertyName and value
export function find(propertyName, value){
	var possibleClassNames = (classesStore[propertyName] || []).filter(item => isEqual(item.value, value));
	return possibleClassNames.length > 0 ? possibleClassNames[0] : null;
}

export function process(mergedStyle){
	// get merged style keys
	var style = {};
	var classNames = [];
	// loop through
	Object.keys(mergedStyle).map(propertyName => {
		var value = mergedStyle[propertyName];
		// does the class already exists?
		var item = put(propertyName, value);
		// if a class name exists, apply it
		if(item){
			// extract the class name and push it into the classNames stack
			var {className} = item;
			classNames.push(className);
		// if no class name exists, then
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