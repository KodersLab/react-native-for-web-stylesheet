// if given item is not an array, make it so.
export function convertToArray(styles){
	// if it is an array, it's ok.
	if(Array.isArray(styles)) return styles;
	// if it is nullish, return an empty array
	if(!styles) return [];
	// if it is an object with numeric keys, returns its values
	if(typeof styles === "object" && !Object.keys(styles).filter(k => (/$[0-9]*/).test(k)).length){
		return Object.keys(styles).map(k => styles[k]);
	}
	// everything else, wrap into an array.
	return [styles];
}

// store deconstructed properties
var deconstructedProperties = {
	padding: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
	margin: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
	borderWidth: ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'],
	borderColor: ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'],
	borderRadius: ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius']
};

// deconstruct property into its counterparts
export function deconstructProperties(style){
	return Object.keys(style).reduce((mergedStyle, prop) => ({
		...mergedStyle,
		...(deconstructedProperties[prop] || [prop])
			.map(aliasProp => ({[aliasProp]: style[prop]}))
			.reduce((mergedProp, aliasPropObj) => ({ ...mergedProp, ...aliasPropObj }))
	}), {});
}

export function omitNullish(styles){
	return styles.filter(style => !!style);
}

export function mergeNativeStyles(styles){
	return convertToArray(styles)
		.filter(omitNullish)
		.map(deconstructProperties)
		.reduce((mergedStyle, style) => ({...mergedStyle, ...style}), {});
}