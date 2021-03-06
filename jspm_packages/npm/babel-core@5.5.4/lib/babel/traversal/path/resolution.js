/* */ 
"format cjs";
"use strict";

exports.__esModule = true;

/**
 * Description
 */

exports.getTypeAnnotation = getTypeAnnotation;

/**
 * Description
 */

exports.getTypeAnnotationInfo = getTypeAnnotationInfo;

/**
 * Resolves `NodePath` pointers until it resolves to an absolute path. ie. a data type instead of a
 * call etc. If a data type can't be resolved then the last path we were at is returned.
 */

exports.resolve = resolve;
exports._resolve = _resolve;

/**
 * Infer the type of the current `NodePath`.
 *
 * NOTE: This is not cached. Use `getTypeAnnotation()` which is cached.
 */

exports.inferTypeAnnotation = inferTypeAnnotation;
exports._inferTypeAnnotation = _inferTypeAnnotation;

/**
 * Description
 */

exports.isTypeAnnotationGeneric = isTypeAnnotationGeneric;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _types = require("../../types");

var t = _interopRequireWildcard(_types);

function getTypeAnnotation() {
  return this.getTypeAnnotationInfo().annotation;
}

function getTypeAnnotationInfo() {
  if (this.typeInfo) {
    return this.typeInfo;
  }

  var info = this.typeInfo = {
    inferred: false,
    annotation: null
  };

  var type = this.node && this.node.typeAnnotation;

  if (!type) {
    info.inferred = true;
    type = this.inferTypeAnnotation();
  }

  if (t.isTypeAnnotation(type)) type = type.typeAnnotation;
  info.annotation = type;

  return info;
}

function resolve(resolved) {
  return this._resolve(resolved) || this;
}

function _resolve(resolved) {
  // detect infinite recursion
  // todo: possibly have a max length on this just to be safe
  if (resolved && resolved.indexOf(this) >= 0) return;

  // we store all the paths we've "resolved" in this array to prevent infinite recursion
  resolved = resolved || [];
  resolved.push(this);

  if (this.isVariableDeclarator()) {
    if (this.get("id").isIdentifier()) {
      return this.get("init").resolve(resolved);
    } else {}
  } else if (this.isReferencedIdentifier()) {
    var binding = this.scope.getBinding(this.node.name);
    if (!binding) return;

    // reassigned so we can't really resolve it
    if (!binding.constant) return;

    // todo - lookup module in dependency graph
    if (binding.kind === "module") return;

    if (binding.path !== this) {
      return binding.path.resolve(resolved);
    }
  } else if (this.isMemberExpression()) {
    // this is dangerous, as non-direct target assignments will mutate it's state
    // making this resolution inaccurate

    var targetKey = this.toComputedKey();
    if (!t.isLiteral(targetKey)) return;

    var targetName = targetKey.value;

    var target = this.get("object").resolve(resolved);

    if (target.isObjectExpression()) {
      var props = target.get("properties");
      var _arr = props;
      for (var _i = 0; _i < _arr.length; _i++) {
        var prop = _arr[_i];
        if (!prop.isProperty()) continue;

        var key = prop.get("key");

        // { foo: obj }
        var match = prop.isnt("computed") && key.isIdentifier({ name: targetName });

        // { "foo": "obj" } or { ["foo"]: "obj" }
        match = match || key.isLiteral({ value: targetName });

        if (match) return prop.get("value").resolve(resolved);
      }
    } else if (target.isArrayExpression() && !isNaN(+targetName)) {
      var elems = target.get("elements");
      var elem = elems[targetName];
      if (elem) return elem.resolve(resolved);
    }
  }
}

function inferTypeAnnotation(force) {
  return this._inferTypeAnnotation(force) || t.anyTypeAnnotation();
}

function _inferTypeAnnotation(force) {
  var path = this.resolve();

  var node = path.node;

  if (!node && path.key === "init" && path.parentPath.isVariableDeclarator()) {
    return t.voidTypeAnnotation();
  }

  if (!node) return;

  if (node.typeAnnotation) {
    return node.typeAnnotation;
  }

  if (path.isRestElement() || path.parentPath.isRestElement() || path.isArrayExpression()) {
    return t.genericTypeAnnotation(t.identifier("Array"));
  }

  if (path.parentPath.isTypeCastExpression()) {
    return path.parentPath.inferTypeAnnotation();
  }

  if (path.isTypeCastExpression()) {
    return node.typeAnnotation;
  }

  if (path.parentPath.isReturnStatement() && !force) {
    return path.parentPath.inferTypeAnnotation();
  }

  if (path.isReturnStatement()) {
    var funcPath = this.findParent(function (node, path) {
      return path.isFunction();
    });
    if (!funcPath) return;

    var returnType = funcPath.node.returnType;
    if (returnType) {
      return returnType;
    } else {
      return this.get("argument").inferTypeAnnotation(true);
    }
  }

  if (path.isNewExpression() && path.get("callee").isIdentifier()) {
    // only resolve identifier callee
    return t.genericTypeAnnotation(node.callee);
  }

  if (path.isReferencedIdentifier()) {
    if (node.name === "undefined") {
      return t.voidTypeAnnotation();
    } else if (node.name === "NaN") {
      return t.numberTypeAnnotation();
    }
  }

  if (path.isObjectExpression()) {
    return t.genericTypeAnnotation(t.identifier("Object"));
  }

  if (path.isFunction() && path.parentPath.isProperty({ kind: "get" })) {
    return node.returnType;
  }

  if (path.isFunction() || path.isClass()) {
    return t.genericTypeAnnotation(t.identifier("Function"));
  }

  if (path.isTemplateLiteral()) {
    return t.stringTypeAnnotation();
  }

  if (path.isUnaryExpression()) {
    var operator = node.operator;

    if (operator === "void") {
      return t.voidTypeAnnotation();
    } else if (t.NUMBER_UNARY_OPERATORS.indexOf(operator) >= 0) {
      return t.numberTypeAnnotation();
    } else if (t.STRING_UNARY_OPERATORS.indexOf(operator) >= 0) {
      return t.stringTypeAnnotation();
    } else if (t.BOOLEAN_UNARY_OPERATORS.indexOf(operator) >= 0) {
      return t.booleanTypeAnnotation();
    }
  }

  if (path.isBinaryExpression()) {
    var operator = node.operator;

    if (t.NUMBER_BINARY_OPERATORS.indexOf(operator) >= 0) {
      return t.numberTypeAnnotation();
    } else if (t.BOOLEAN_BINARY_OPERATORS.indexOf(operator) >= 0) {
      return t.booleanTypeAnnotation();
    } else if (operator === "+") {
      var right = path.get("right").resolve();
      var left = path.get("left").resolve();

      if (left || right) {
        if (left.isTypeAnnotationGeneric("Number") && right.isTypeAnnotationGeneric("Number")) {
          // both numbers so this will be a number
          return t.numberTypeAnnotation();
        } else if (left.isTypeAnnotationGeneric("String") || right.isTypeAnnotationGeneric("String")) {
          // one is a string so the result will be a string
          return t.stringTypeAnnotation();
        }
      }

      // unsure if left and right are strings or numbers so stay on the safe side
      return t.unionTypeAnnotation([t.stringTypeAnnotation(), t.numberTypeAnnotation()]);
    }
  }

  if (path.isLogicalExpression()) {}

  if (path.isConditionalExpression()) {}

  if (path.isSequenceExpression()) {
    return this.get("expressions").pop().inferTypeAnnotation(force);
  }

  if (path.isAssignmentExpression()) {
    return this.get("right").inferTypeAnnotation(force);
  }

  if (path.isUpdateExpression()) {
    var operator = node.operator;
    if (operator === "++" || operator === "--") {
      return t.numberTypeAnnotation();
    }
  }

  if (path.isLiteral()) {
    var value = node.value;
    if (typeof value === "string") return t.stringTypeAnnotation();
    if (typeof value === "number") return t.numberTypeAnnotation();
    if (typeof value === "boolean") return t.booleanTypeAnnotation();
    if (node.regex) return t.genericTypeAnnotation(t.identifier("RegExp"));
  }

  var callPath;
  if (path.isCallExpression()) callPath = path.get("callee");
  if (path.isTaggedTemplateExpression()) callPath = path.get("tag");
  if (callPath) {
    var callee = callPath.resolve();
    // todo: read typescript/flow interfaces
    if (callee.isNodeType("Function")) return callee.node.returnType;
  }
}

function isTypeAnnotationGeneric(genericName) {
  var opts = arguments[1] === undefined ? {} : arguments[1];

  var typeInfo = this.getTypeAnnotationInfo();
  var type = typeInfo.annotation;
  if (!type) return false;

  if (typeInfo.inferred && opts.inference === false) {
    return false;
  }

  if (t.isGenericTypeAnnotation(type) && t.isIdentifier(type.id, { name: genericName })) {
    if (opts.requireTypeParameters && !type.typeParameters) {
      return false;
    } else {
      return true;
    }
  }

  if (genericName === "String") {
    return t.isStringTypeAnnotation(type);
  } else if (genericName === "Number") {
    return t.isNumberTypeAnnotation(type);
  } else if (genericName === "Boolean") {
    return t.isBooleanTypeAnnotation(type);
  }

  return false;
}

// otherwise it's a request for a pattern and that's a bit more tricky

// todo: create UnionType of left and right annotations

// todo: create UnionType of consequent and alternate annotations