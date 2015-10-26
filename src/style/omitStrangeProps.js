// this module loops through an array of styles, or an array of arrays, or nullish and omit declarations of
// a specified set of props that are not translable into css ones. (like resizeMode or tintColor, which are handled)
// by the Image component itself.

var propertiesToOmit = ['tintColor', 'resizeMode'];

export default (style) => {
	// create a new var for the exported style
	var omittedStyle = {};

	// loop through props
	Object.keys(style).filter(propertyName => propertiesToOmit.indexOf(propertyName) === -1).map(propertyName => {
		omittedStyle[name] = style[propertyName];
	});

	// return the new style.
	return omittedStyle;
}