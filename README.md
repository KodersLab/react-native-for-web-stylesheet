React Native for Web Stylesheet
=======
Reuse your React Native styles inside your React DOM application!

### How can i install this?
- Go into your project folder and install react-native-for-web-stylesheet
```
npm install react-native-for-web-stylesheet
```

### Building the library
Move into the package folder and run in your terminal:
```
npm run build
```

### WARNING!
This package is in beta version! API may be changed during lifecycle!

### Design goals
 - Expose a compatible API with the React Native one, so you can reuse the StyleSheets over the web
 - Provide a StyleSheet with an EventEmitter, so we can subscribe to StyleSheet updates and re-render the stylesheet
 - Provide multiple render ways, renderToString on server and renderToStyleTag on the client

 - Allows dump and load of the internal storage, allowing to dump CSS to a separate stylesheet file, enabling CSS caching
 - Exposes multiple storage ways (in-memory, in-disk, etc...)

 - Automatically translates React Native style properties in CSS properties
 - Expose a pluggable way to register methods that translates (classNameId, propertyName, value) => CSSRuleString
 - Allows to register custom classNames among with their CSS implementation, and reuse them in components
 
 - Is framework independent, exposing a function that given an array of styles and optional additional styles and classNameIds, returns the className and the style in a DOM fashion 