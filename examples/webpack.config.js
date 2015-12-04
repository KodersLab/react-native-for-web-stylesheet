var StyleSheetPlugin = require('../lib/webpack');

module.exports = {
    context: __dirname,
    entry: {
        'index': ['./src/index.js']
    },
    devtool: "source-map",
    output: {
        path: __dirname,
        filename: "index.js",
        sourceMapFilename: "index.map"
    },

    module: {
        loaders: [
            { test: /\.js$/, loader: "babel-loader"}
        ]
    },
    
    plugins: [new StyleSheetPlugin({filename: "app.css"})]
};