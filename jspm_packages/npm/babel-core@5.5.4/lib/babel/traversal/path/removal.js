/* */ 
"format cjs";
"use strict";

exports.__esModule = true;

/**
 * Deprecated in favor of `dangerouslyRemove` as it's far more scary and more accurately portrays
 * the risk.
 */

exports.remove = remove;

/**
 * Description
 */

exports.dangerouslyRemove = dangerouslyRemove;
exports._callRemovalHooks = _callRemovalHooks;
exports._remove = _remove;
exports._markRemoved = _markRemoved;

/**
 * Share comments amongst siblings.
 */

exports.shareCommentsWithSiblings = shareCommentsWithSiblings;

/**
 * Give node `comments` of the specified `type`.
 */

exports.giveComments = giveComments;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _libRemovalHooks = require("./lib/removal-hooks");

var removalHooks = _interopRequireWildcard(_libRemovalHooks);

function remove() {
  console.trace("Path#remove has been renamed to Path#dangerouslyRemove, removing a node is extremely dangerous so please refrain using it.");
  return this.dangerouslyRemove();
}

function dangerouslyRemove() {
  this.resync();

  if (this._callRemovalHooks("pre")) {
    this._markRemoved();
    return;
  }

  this.shareCommentsWithSiblings();
  this._remove();
  this._markRemoved();

  this._callRemovalHooks("post");
}

function _callRemovalHooks(position) {
  var _arr = removalHooks[position];

  for (var _i = 0; _i < _arr.length; _i++) {
    var fn = _arr[_i];
    if (fn(this, this.parentPath)) return true;
  }
}

function _remove() {
  if (Array.isArray(this.container)) {
    this.container.splice(this.key, 1);
    this.updateSiblingKeys(this.key, -1);
  } else {
    this.container[this.key] = null;
  }
}

function _markRemoved() {
  this.node = null;
  this.removed = true;
}

function shareCommentsWithSiblings() {
  var node = this.node;
  if (!node) return;

  var trailing = node.trailingComments;
  var leading = node.leadingComments;
  if (!trailing && !leading) return;

  var prev = this.getSibling(this.key - 1);
  var next = this.getSibling(this.key + 1);

  if (!prev.node) prev = next;
  if (!next.node) next = prev;

  prev.giveComments("trailing", leading);
  next.giveComments("leading", trailing);
}

function giveComments(type, comments) {
  if (!comments) return;

  var node = this.node;
  if (!node) return;

  var key = "" + type + "Comments";

  if (node[key]) {
    node[key] = node[key].concat(comments);
  } else {
    node[key] = comments;
  }
}