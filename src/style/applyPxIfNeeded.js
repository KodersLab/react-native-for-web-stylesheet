// this module is responsible for apply a px suffix if property is numeric
// and if the property name in react native is treated as a number but on
// the css version it actually needs a unit to be fully valid.

// the list of the properties that needs a px suffix
var propsThatNeedsPx = [
	'borderRadius',
	'borderTopLeftRadius',
	'borderTopRightRadius',
	'borderBottomLeftRadius',
	'borderBottomRightRadius',
	'borderWidth',
	'borderTopWidth',
	'borderBottomWidth',
	'borderLeftWidth',
	'borderRightWidth',
	'bottom',
	'height',
	'left',
	'margin',
	'marginBottom',
	'marginTop',
	'marginLeft',
	'marginRight',
	'marginHorizontal',
	'marginVertical',
	'padding',
	'paddingVertical',
	'paddingHorizontal',
	'paddingTop',
	'paddingBottom',
	'paddingLeft',
	'paddingRight',
	'right',
	'shadowRadius',
	'top',
	'width',
	'fontSize',
	'lineHeight'
];

export default (style) => {
	// create a new style object
	var suffixedStyle = {};
	// loop through properties
	Object.keys(style).map(propertyName => {
		suffixedStyle[propertyName] = (propsThatNeedsPx.indexOf(propertyName) > -1 && typeof style[propertyName] === 'number') ?
			style[propertyName] + 'px' : 
			style[propertyName];
	});
	
	// returns the new style object
	return suffixedStyle;
};