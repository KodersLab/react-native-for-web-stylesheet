import {renderToString} from './index';
import {writeFile} from 'fs';

class StyleSheetPlugin{
	constructor(options) {
		this.options = {
			filename: "app.css",
			...options
		};
	}
	
	apply(compiler){
		var {filename} = this.options;
			
		compiler.plugin("emit", (compilation, callback) => {
			writeFile(filename, renderToString());
			callback();
		});
	}
}

module.exports = StyleSheetPlugin;