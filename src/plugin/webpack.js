import {renderToString} from '../index';
import {writeFile} from 'fs';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';

class StyleSheetPlugin{
	constructor(options) {
		this.options = {
			filename: "app.css",
			...options
		};
	}
	
	apply(compiler){
		var {filename} = this.options;
			
		compiler.plugin("done", (stats) => {
			var css = renderToString();

			postcss([ autoprefixer ]).process(css).then(function (result) {
				result.warnings().forEach(function (warn) {
					console.warn(warn.toString());
				});
				writeFile(filename, result.css);
			});
			
		});
	}
}

module.exports = StyleSheetPlugin;