import store from './store';

function getCssPropertyName(jsStylePropertyName){
	return jsStylePropertyName.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function getCssValue(propertyName, jsValue){
	return jsValue;
}

export default function renderToString(){
	// lock the store for changes, further changes will be converted into inline styles
	store.lock();
	
	// build the rules string
	var rules = [];
	
	// for each property
	Object.keys(store.classesStore).map(propertyName => {
		// for each item
		store.classesStore[propertyName].map(storeItem => {
			// push the rule definition
			rules.push('.' + storeItem.className + '{' + getCssPropertyName(propertyName) + ':' + getCssValue(propertyName, storeItem.value) + '}');
		});
	});
	
	return rules.join(' ');
}