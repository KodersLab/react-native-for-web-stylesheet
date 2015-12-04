import multi from './data/multi';

export function destruct(mergedStyle){
	// first omit the multi props from the style 
	var style = {};
	Object.keys(mergedStyle)
		.filter(propName => multi[propName] === undefined)
		.forEach(propName => style[propName] = mergedStyle[propName]);

	// then merge with the current style
	return Object.keys(multi)
		.filter(propName => mergedStyle[propName] !== undefined)
		.reduce((style, propName) => {
			// stores the value
			var propValue = mergedStyle[propName];
			
			return {
				// an object with keys as the multi prop translation
				...multi[propName]
					.reduce((rules, aliasPropName) => ({...rules, [aliasPropName]: propValue}), {}),
				// the previous style
				...style
			};
		}, style);
}

export function toArray(styles){
	// is already an array? return it!
	if(Array.isArray(styles)) return styles;
	// if it is nullish, return empty array
	if(!styles) return [];
	// if it is an object with numeric keys, returns its values
	if(typeof styles === "object" && !Object.keys(styles).filter(k => (/$[0-9]*/).test(k)).length){
		return Object.keys(styles).map(k => styles[k]);
	}
	// just wrap in an array the current styles
	return [styles];
}