import store from './store';

export function create(styles){
	// loop through style definitions
	Object.keys(style).map(style => {
		Object.keys(style).map(propertyName => {
			// put the property and value definition into the store
			store.put(propertyName, style[propertyName]);
		});
	});
	// return the unchanged styles
	return styles;
}