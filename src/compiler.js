import unitlessProperties from './data/unitless';
import storage from './storage';

function cssPropName(propName){
	return propName.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function cssPropValue(propName, propValue){
	switch(propName.toLowerCase()){
		default:
			return typeof propValue === 'number' && !unitlessProperties[propName] ?
				propValue + 'px' :
				propValue;
	}
}

export function classNameFor(classId, propName, propValue){
	return '_' + (parseInt(classId, 10).toString(36));
}

export function ruleFor(classId, propName, propValue){
	switch(propName){
		case 'resizeMode':
		case 'tintColor':
			return '';
		default:
			return '.' + 
				classNameFor(classId, propName, propValue) 
				+ '{' + 
				cssPropName(propName) + ':' + cssPropValue(propName, propValue)
				+ ';}';
	}
}

export function browserify(nativeStyle){
	var style = {}, propValue;
	
	Object.keys(nativeStyle)
		.forEach(propName => {
			propValue = nativeStyle[propName];
			style[propName] = cssPropValue(propName, propValue);
		});
	
	return style;
}