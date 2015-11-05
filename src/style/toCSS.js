import unitlessProperties from '../data/unitlessProperties';

export default (propertyName, value) => {
	return propertyName.replace(/([A-Z])/g, '-$1').toLowerCase()
		+ ':' + 
		(
			typeof value === 'number' && typeof unitlessProperties[propertyName] === 'undefined' ?
				value + 'px' :
				value
		);
};