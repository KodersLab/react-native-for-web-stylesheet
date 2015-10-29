import store from './store';
import {mergeNativeStyles, browserifyStyle} from './style';

export default function StyledComponent(modifyComputedStyleFn, modifyBrowserifiedStyleFn){
	return Component => (props, ctx) => {
		// extract style prop
		var {style, ...props} = props;
		
		// convert the style to an array if it is not so
		style = mergeNativeStyles(style);
		
		// apply user-defined changes to the computed style
		if(modifyComputedStyleFn) style = modifyComputedStyleFn(style, props);
		
		// browserify the given style
		var newStyle = browserifyStyle(style);
		
		// apply user-defined changes to the browserified style
		if(modifyBrowserifiedStyleFn) newStyle = modifyBrowserifiedStyleFn(newStyle);

		// convert style declarations into a className or style definition
		var {classNames, style} = store.process(newStyle);
		
		// return the wrapped component
		return <Component {...props} className={classNames.join(' ')} style={style} />;
	};
}