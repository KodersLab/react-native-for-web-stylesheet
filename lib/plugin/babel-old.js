'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;

  // is a StyleSheet.create call?
  var isStyleSheetCall = t.buildMatchMemberExpression('StyleSheet.create');
  function isStyleSheetCreateCall(node) {
    return t.isMemberExpression(node) && isStyleSheetCall(node);
  }

  function generateNewClassId(className, propName, propValue) {
    nextId++;
    return nextId;
  }

  function isValidClassNameType(node) {
    return t.isIdentifier(node) || t.isStringLiteral(node);
  }

  function getClassName(classNode) {
    if (t.isIdentifier(classNode.key)) {
      return classNode.key.name;
    }
    return classNode.key.value;
  }

  function isValidPropertyNameType(node) {
    return t.isIdentifier(node) || t.isStringLiteral(node);
  }

  function getPropertyName(propNode) {
    if (t.isIdentifier(propNode.key)) {
      return propNode.key.name;
    }
    return propNode.key.value;
  }

  function getPropertyValue(propNode) {
    return propNode.value.value;
  }

  // loop through objectExpression and find classNames and calls the callback
  function forEachStyleSheetClassName(styleSheetNode, callback) {
    var classes, classProp;

    // if this is not an object, skip
    if (!t.isObjectExpression(styleSheetNode)) return;

    // loop through defined classes
    classes = styleSheetNode.properties;
    for (var j = 0; j < classes.length; j++) {
      // this is the ObjectProperty
      classProp = classes[j];

      // key is not an identifier, skip class
      if (!isValidClassNameType(classProp.key)) continue;
      if (!t.isObjectExpression(classProp.value)) continue;

      // call the callback
      callback(classProp);
    }
  }

  // loop through classNode props
  function forEachClassProp(classNode, callback) {
    var props, prop;

    // if this is not an object, skip
    if (!t.isObjectExpression(classNode)) return;

    // loop through defined classes
    props = classNode.properties;
    for (var j = 0; j < props.length; j++) {
      prop = props[j];

      // key is not an identifier, skip class
      if (!isValidPropertyNameType(prop.key)) continue;

      // call the callback
      callback(prop);
    }
  }

  // convert object to AST
  function dumpToAST(obj) {
    var classes = [],
        props = [];

    Object.keys(obj).map(function (className) {
      props = [];

      Object.keys(obj[className]).map(function (propName) {
        props.push(t.objectProperty(t.identifier(propName), valueToAST(obj[className][propName])));
      });

      if (props.length > 0) classes.push(t.objectProperty(t.identifier(className), t.objectExpression(props)));
    });

    return t.objectExpression(classes);
  }

  // convert a single css value to it's AST equivalent
  function valueToAST(value) {
    if (typeof value === 'string') {
      return t.stringLiteral(value);
    } else if (typeof value === 'number') {
      return t.numericLiteral(value);
    }
    return t.numericLiteral(-1);
  }

  return {
    visitor: {
      CallExpression: function CallExpression(path) {
        var args, propName, propValue, className, possibleIds, classId, styleSheetIds;
        var callee = path.node.callee;

        // is a StyleSheet.create call?
        if (isStyleSheetCreateCall(callee)) {

          args = path.node.arguments;
          for (var i = 0; i < args.length; i++) {
            styleSheetIds = {};

            forEachStyleSheetClassName(args[i], function (classNode) {

              forEachClassProp(classNode.value, function (propNode) {
                className = getClassName(classNode);
                propName = getPropertyName(propNode);
                propValue = getPropertyValue(propNode);

                store[propName] = store[propName] === undefined ? {} : store[propName];
                possibleIds = Object.keys(store[propName]).filter(function (classId) {
                  return store[propName][classId] === propValue;
                });
                if (possibleIds.length === 0) {
                  classId = generateNewClassId();
                  store[propName][classId] = propValue;
                } else {
                  classId = possibleIds[0];
                }

                styleSheetIds[className] = styleSheetIds[className] || {};
                styleSheetIds[className][propName] = classId;
              });
            });
          }

          path.node.arguments.push(dumpToAST(styleSheetIds));
        }
      }
    }
  };
};

var nextId = 0;
var store = {};