import isEqual from 'lodash.isequal';

var nextClassId = 0;
export var storage = {};

// get the classId
export function pick(propName, propValue){
	var possibleClassIds = Object.keys(storage[propName] || {})
		.filter(classId => isEqual(storage[propName][classId], propValue));
		
	return possibleClassIds.length > 0 ? parseInt(possibleClassIds[0], 10) : null;
}

// sets the classId
export function put(propName, propValue, classId){
	if(pick(propName, propValue)) return false;
	
	if(!classId){
		nextClassId++;
		classId = nextClassId;
	}
	
	nextClassId = nextClassId < classId ? classId : nextClassId;
	
	storage[propName] = storage[propName] || {};
	storage[propName][classId] = propValue;
	
	return true;
}