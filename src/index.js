import MemoryStorage from './storage/memory';
import resolveMultiProperties from './style/resolveMultiProperties';
import toStylesArray from './style/toStylesArray';
import toCSS from './style/toCSS';

// counter for classNameId is global to avoid collisions
var lastClassNameId = 0;

// an helper function which takes a new id and then increments
function newClassNameId(){
	lastClassNameId++;
	return lastClassNameId;
}

// the StyleSheet which should be instanciated
export default class StyleSheet{
	constructor(){
		// create the store to be used
		this._listeners = [];
		this._overrides = {};
		this._store = new MemoryStorage();
		
		this._blockElementClassNameId = newClassNameId();
		this._inlineElementClassNameId = newClassNameId();
	}
	
	// given property name and value, returns the class name
	_classNameFor(classNameId, propertyName, value){
		// if not, provide a short class name
		return '_' + parseInt(classNameId, 10).toString(36);
	}
	
	// subscribe to a stylesheet changed
	subscribe(fn){
		this._listeners.push(fn);
		var isListening = true;
		
		return () => {
			if(!isListening) return;
			
			isListening = false;
			var idx = this._listeners.indexOf(fn);
			this._listeners.splice(idx, 1);
		};
	}
	
	override(propertyName, cssCodeFn){
		this._overrides[propertyName] = cssCodeFn; // (classNameId, value) => cssCode
	}
	
	create(styles){
		// loop through definitions
		for(var styleName in styles){
			if(!styles.hasOwnProperty(styleName)) continue;
			
			// deconstruct and cache deconstructed if possible
			var style = resolveMultiProperties(styles[styleName]);

			// continue looping
			for(var propertyName in style){
				if(!style.hasOwnProperty(propertyName)) continue;
				
				// ...then store it!
				this._store.put(newClassNameId(), propertyName, style[propertyName]);
			}
		}
		
		// emit that the stylesheet changed
		this._listeners.slice().forEach(listener => listener());
		
		// return anyway the styles
		return styles;
	}
	
	resolve(styles, options = {}){
		// decode options
		var {isBlockElement = true, modifyMergedStyle, modifyClassNameIds} = options;
		
		// attempt to merge given styles
		var mergedStyle = toStylesArray(styles)
			.reduce((mergedStyle, style) => ({...mergedStyle, ...style}), {});
			
		// call the user defined modifyMergedStyle
		if(modifyMergedStyle) mergedStyle = modifyMergedStyle(mergedStyle);
		
		// deconstruct multi properties to their specific counterparts
		mergedStyle = resolveMultiProperties(mergedStyle);
		
		// get class ids
		var style = {};
		var classNames = {};
		Object.keys(mergedStyle)
			.forEach(propertyName => {
				// attempt to get the classNameId
				var value = mergedStyle[propertyName];
				var classNameId = this._store.pick(propertyName, value);
				// if it is not found, fall back to an inline style.
				if(classNameId === null){
					style[propertyName] = value;
				// or return the className
				}else{
					classNames[classNameId] = {propertyName, value};
				}
			});
			
		// if isBlockElement or isInlineElement, append the block element class
		if(isBlockElement){
			classNames[this._blockElementClassNameId] = {};	
		}else{
			classNames[this._inlineElementClassNameId] = {};
		}
				
		// call the user defined modifyClassNames
		if(modifyClassNameIds) classNames = modifyClassNameIds(classNames);
		
		// get the actual classNames
		classNames = Object.keys(classNames)
			.map(classNameId => this._classNameFor(classNameId, classNames[classNameId].propertyName, classNames[classNameId].value));
		
		// returns the className and the style object
		return {
			className: classNames.join(' '),
			style
		};
	}
	
	renderToString(){
		var rules = [];
		
		// prepend the inline and the block element classes
		var blockElementClassName = this._classNameFor(this._blockElementClassNameId);
		var inlineElementClassName = this._classNameFor(this._inlineElementClassNameId);
		
		// push to the rules
		rules.push(`
		html, body, #app{
			margin: 0;
			padding: 0;
			
			font-family: Helvetica;
			font-size: 14px;
			font-weight: 100;
			
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}
		
		.${blockElementClassName}{
			box-sizing: border-box;
			position: relative;
			border: 0 solid black;
			margin: 0;
			padding: 0;
			display: flex;
			flex-direction: column;
			align-items: stretch;
			justify-content: flex-start;
			flex: 0 0 auto;
			
			background-color: transparent;
			color: inherit;
			font: inherit;
			text-align: inherit;
		}
		.${inlineElementClassName}{display: inline-block}
		`);
		
		// get the current dump
		var storage = this._store.dump();
		
		// compile to a CSS string
		Object.keys(storage).forEach(propertyName => {
			Object.keys(storage[propertyName]).forEach(classNameId => {
				var value = storage[propertyName][classNameId];
				var className = this._classNameFor(classNameId, propertyName, value);
				
				if(typeof this._overrides[propertyName] !== 'undefined'){
					rules.push(this._overrides[propertyName](className, classNameId, value));
				}else{
					rules.push('.' + className + '{' + toCSS(propertyName, value) + '}');
				}
			});
		});
		
		return rules.join(' ');
	}
	
	renderToStyleTag(styleNode){
		// render the string of the stylesheet to the style tag
		styleNode.textContent = this.renderToString();
	}
}
