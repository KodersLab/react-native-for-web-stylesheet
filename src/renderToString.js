import store from './store';

function getCssPropertyName(jsStylePropertyName){
	return jsStylePropertyName.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function getCssValue(propertyName, jsValue){
	return jsValue;
}

export default function renderToString(){
	var rules = [];
	
	Object.keys(store.classesStore).map(propertyName => {
		store.classesStore[propertyName].map(storeItem => {
			rules.push('.' + storeItem.className + '{' + getCssPropertyName(propertyName) + ':' + getCssValue(propertyName, storeItem.value) + '}');
		});
	});
	
	return rules.join(' ');
}