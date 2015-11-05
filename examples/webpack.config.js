module.exports = {
    context: __dirname,
    entry: {
        'index': ['./index.js']
    },
    devtool: "source-map",
    output: {
        path: __dirname,
        filename: "bundle.web.js",
        sourceMapFilename: "bundle.web.map"
    },
    resolve: {
      alias: {
        // this is just for example sake, when installing via npm it will not be necessary  
        "react-native-for-web-stylesheet": __dirname + "/../src/"
      }
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader?stage=1"}
        ]
    }
};
