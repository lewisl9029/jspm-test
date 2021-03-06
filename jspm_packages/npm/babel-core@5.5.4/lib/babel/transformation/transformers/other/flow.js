/* */ 
"format cjs";
"use strict";

exports.__esModule = true;
exports.Flow = Flow;
exports.ClassProperty = ClassProperty;
exports.Class = Class;
exports.Func /*tion*/ = Func;
exports.TypeCastExpression = TypeCastExpression;
exports.ImportDeclaration = ImportDeclaration;
exports.ExportDeclaration = ExportDeclaration;
var metadata = {
  group: "builtin-trailing"
};

exports.metadata = metadata;

function Flow(node) {
  this.dangerouslyRemove();
}

function ClassProperty(node) {
  node.typeAnnotation = null;
  if (!node.value) this.dangerouslyRemove();
}

function Class(node) {
  node["implements"] = null;
}

function Func(node) {
  for (var i = 0; i < node.params.length; i++) {
    var param = node.params[i];
    param.optional = false;
  }
}

function TypeCastExpression(node) {
  return node.expression;
}

function ImportDeclaration(node) {
  if (node.isType) this.dangerouslyRemove();
}

function ExportDeclaration(node) {
  if (this.get("declaration").isTypeAlias()) this.dangerouslyRemove();
}