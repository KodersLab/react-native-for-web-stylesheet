import store from './store';

export default function StyledComponent(modifyComputedStyleFn){
	return Component => (props, ctx) => {
		// extract style prop
		var {style, ...props} = props;
		
		// browserify the given style
		var newStyle = browserify(style);
		
		// apply user-defined changes to the computed style
		newStyle = modifyComputedStyleFn(newStyle, props);

		// convert style declarations into a className or style definition
		var {classNames, style} = store.process(newStyle);
		
		// return the wrapped component
		return <Component {...props} className={classNames.join(' ')} style={style} />;
	};
}