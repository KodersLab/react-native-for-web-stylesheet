import multiProperties from '../data/multiProperties';

export default function resolveMultiProperties(style){
	// first omit the multi props from the style 
	var newStyle = {};
	Object.keys(style)
		.filter(propertyName => typeof multiProperties[propertyName] === 'undefined')
		.forEach(propertyName => newStyle[propertyName] = style[propertyName]);

	// then merge with the current style
	return Object.keys(multiProperties)
		.filter(propertyName => typeof style[propertyName] !== 'undefined')
		.reduce((newStyle, propertyName) => {
			// stores the value
			var value = style[propertyName];
			
			return {
				// an object with keys as the multi prop translation
				...multiProperties[propertyName]
					.reduce((rules, aliasPropertyName) => ({...rules, [aliasPropertyName]: value}), {}),
				// the previous style
				...newStyle
			};
		}, newStyle);
}
