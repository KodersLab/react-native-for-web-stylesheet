import {put, pick} from '../storage';
import {destruct} from '../utils';

export default function ({types: t}){
	
	var isStyleSheetCall = t.buildMatchMemberExpression('StyleSheet.create');
	function isStyleSheetCreateCall(node){
		return t.isMemberExpression(node) && isStyleSheetCall(node);
	}
	
	function getClassNodes(styleSheetNode){
		// if this is not an object, skip
		if(!t.isObjectExpression(styleSheetNode)) return [];
		
		// loop through defined classes
		return styleSheetNode.properties.map(classNode => {
			// key is not an identifier and value is not an object expression, skip class def
			if(!t.isIdentifier(classNode.key) || !t.isObjectExpression(classNode.value)){
				return;
			}
			
			// this is a valid class node
			return classNode;
		}).filter(classNode => !!classNode);
	}
	
	function getPropertyNodes(classNode){
		// if this is not an object, skip
		if(!t.isObjectExpression(classNode)) return [];
		
		// loop through defined classes
		return classNode.properties.map(propertyNode => {
			// key is not an identifier and value is not an object expression, skip class def
			if(!t.isIdentifier(propertyNode.key)){
				return;
			}
			
			if(!(t.isStringLiteral(propertyNode.value) || t.isNumericLiteral(propertyNode.value))){
				return;
			}
			
			// this is a valid class node
			return propertyNode;
		}).filter(propertyNode => !!propertyNode);
	}
	
	function astify(value){
		switch(typeof value){
			case 'string':
				return t.stringLiteral(value);
			case 'number':
				return t.numericLiteral(value);
			default:
				if(Array.isArray(value)){
					return t.arrayExpression(value.map(astify));
				}
				
				return t.objectExpression(Object.keys(value)
					.filter(key => typeof value[key] !== 'undefined')
					.map(key => t.objectProperty(
						t.identifier(key),
						astify(value[key])
					)));
		}
	}
	
	return {
		visitor: {
			CallExpression(path){
				var callee = path.node.callee;
				var sheetStore = {};
				
				// is a StyleSheet.create call?
				if(isStyleSheetCreateCall(callee)){
					var args = path.node.arguments;
					
					// not enough arguments
					if(!args.length) return;
					
					// forEach styleSheet class
					getClassNodes(args[0]).forEach(classNode => {
						var className = classNode.key.name;
						var style = {};
						sheetStore[className] = {};
						
						getPropertyNodes(classNode.value).forEach(propertyNode => {
							var propName = propertyNode.key.name;
							var propValue = propertyNode.value.value;
							
							style[propName] = propValue;						
						});
						
						style = destruct(style);
						
						Object.keys(style).forEach(propName => {
							var propValue = style[propName];
							
							put(propName, propValue);
							var classId = pick(propName, propValue);
							sheetStore[className][propName] = classId;	
						})
					});
						
					
					// push dumped store into args
					path.node.arguments.push(astify(sheetStore));
				}
			}
		}
	};
}