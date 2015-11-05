import BaseStorage from './base';
import isEqual from 'lodash.isequal';

export default class MemoryStorage extends BaseStorage{
	constructor(options){
		super();
		// store the classNameIds in a object
		this.storage = {};
	}

	pick(propertyName, value){
		// lookup in every sub-object value and return its key
		var possibleClassNameIds = Object.keys(this.storage[propertyName] || {})
			.filter(classNameId => isEqual(this.storage[propertyName][classNameId], value));
		// return the classNameId or null if none is found
		return possibleClassNameIds.length > 0 ? possibleClassNameIds[0] : null;
	}
	
	put(classNameId, propertyName, value){
		// if already stored, return
		if(this.pick(propertyName, value) !== null) return;
		// if not stored, create the record
		this.storage[propertyName] = this.storage[propertyName] || {};
		// put the classNameId and the propertyName and value
		this.storage[propertyName][classNameId] = value;
	}
	
	dump(){
		return this.storage;
	}
	
	shutdown(){
		// destroy the object so it can be gc
		this.storage = null;
	}
}