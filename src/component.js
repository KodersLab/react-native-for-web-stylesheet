

export default function StyledComponent(modifyComputedStyleFn){
	return Component => (props, ctx) => {
		// extract style prop
		var {style, ...props} = props;
		
		// browserify the given style
		var newStyle = browserify(style);
		
		// apply user-defined changes to the computed style
		newStyle = modifyComputedStyleFn(newStyle);
		
		// if is in server, return className, on client, use inline styles
		if(ctx.styleSheetStorage){
			// convert style declarations into a className definition
			var classNames = ctx.styleSheetStorage.getClassNamesFor(newStyle);
			// return the wrapped component
			return <Component {...props} className={classNames.join(' ')} />;
		}else{
			// apply the merged style to the wrapped component
			return <Component {...props} style={newStyle} />;
		}
	};
}