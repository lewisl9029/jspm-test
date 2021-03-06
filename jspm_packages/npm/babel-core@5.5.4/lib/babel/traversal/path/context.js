/* */ 
"format cjs";
"use strict";

exports.__esModule = true;

/**
 * Description
 */

exports.call = call;

/**
 * Description
 */

exports.isBlacklisted = isBlacklisted;

/**
 * Description
 */

exports.visit = visit;

/**
 * Description
 */

exports.skip = skip;

/**
 * Description
 */

exports.skipKey = skipKey;

/**
 * Description
 */

exports.stop = stop;

/**
 * Description
 */

exports.setScope = setScope;

/**
 * Description
 */

exports.setContext = setContext;

/**
 * Here we resync the node paths `key` and `container`. If they've changed according
 * to what we have stored internally then we attempt to resync by crawling and looking
 * for the new values.
 */

exports.resync = resync;
exports._resyncKey = _resyncKey;
exports._resyncContainer = _resyncContainer;

/**
 * Description
 */

exports.shiftContext = shiftContext;

/**
 * Description
 */

exports.unshiftContext = unshiftContext;

/**
 * Description
 */

exports.setup = setup;

/**
 * Description
 */

exports.setKey = setKey;

/**
 * Description
 */

exports.queueNode = queueNode;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _messages = require("../../messages");

var messages = _interopRequireWildcard(_messages);

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../index");

var _index4 = _interopRequireDefault(_index3);

function call(key) {
  var node = this.node;
  if (!node) return;

  var opts = this.opts;
  if (!opts[key] && !opts[node.type]) return;

  var fns = [].concat(opts[key]);
  if (opts[node.type]) fns = fns.concat(opts[node.type][key]);

  var _arr = fns;
  for (var _i = 0; _i < _arr.length; _i++) {
    var fn = _arr[_i];
    if (!fn) continue;

    var _node = this.node;
    if (!_node) return;

    var previousType = this.type;

    // call the function with the params (node, parent, scope, state)
    var replacement = fn.call(this, _node, this.parent, this.scope, this.state);

    if (replacement) {
      this.replaceWith(replacement, true);
    }

    if (this.shouldStop || this.shouldSkip || this.removed) return;

    if (previousType !== this.type) {
      this.queueNode(this);
      return;
    }
  }
}

function isBlacklisted() {
  var blacklist = this.opts.blacklist;
  return blacklist && blacklist.indexOf(this.node.type) > -1;
}

function visit() {
  if (this.isBlacklisted()) return false;
  if (this.opts.shouldSkip && this.opts.shouldSkip(this)) return false;

  this.call("enter");

  if (this.shouldSkip) {
    return this.shouldStop;
  }

  var node = this.node;
  var opts = this.opts;

  if (node) {
    if (Array.isArray(node)) {
      // traverse over these replacement nodes we purposely don't call exitNode
      // as the original node has been destroyed
      for (var i = 0; i < node.length; i++) {
        _index4["default"].node(node[i], opts, this.scope, this.state, this, this.skipKeys);
      }
    } else {
      _index4["default"].node(node, opts, this.scope, this.state, this, this.skipKeys);
      this.call("exit");
    }
  }

  return this.shouldStop;
}

function skip() {
  this.shouldSkip = true;
}

function skipKey(key) {
  this.skipKeys[key] = true;
}

function stop() {
  this.shouldStop = true;
  this.shouldSkip = true;
}

function setScope(file) {
  if (this.opts && this.opts.noScope) return;

  var target = this.context || this.parentPath;
  this.scope = _index2["default"].getScope(this, target && target.scope, file);
  if (this.scope) this.scope.init();
}

function setContext(context, file) {
  this.shouldSkip = false;
  this.shouldStop = false;
  this.removed = false;
  this.skipKeys = {};

  if (context) {
    this.context = context;
    this.state = context.state;
    this.opts = context.opts;
  }

  var log = file && this.type === "Program";
  if (log) file.log.debug("Start scope building");
  this.setScope(file);
  if (log) file.log.debug("End scope building");

  return this;
}

function resync() {
  if (this.removed) return;

  this._resyncContainer();
  this._resyncKey();
}

function _resyncKey() {
  if (this.node === this.container[this.key]) return;

  // grrr, path key is out of sync. this is likely due to a modification to the AST
  // not done through our path APIs

  if (Array.isArray(this.container)) {
    for (var i = 0; i < this.container.length; i++) {
      if (this.container[i] === this.node) {
        return this.setKey(i);
      }
    }
  } else {
    for (var key in this.container) {
      if (this.container[key] === this.node) {
        return this.setKey(key);
      }
    }
  }

  throw new Error(messages.get("lostTrackNodePath"));
}

function _resyncContainer() {
  var containerKey = this.containerKey;
  var parentPath = this.parentPath;
  if (!containerKey || !parentPath) return;

  var newContainer = parentPath.node[containerKey];
  if (!newContainer || this.container === newContainer) return;

  // container is out of sync. this is likely the result of it being reassigned

  this.container = newContainer;
}

function shiftContext() {
  this.contexts.shift();
  this.setContext(this.contexts[0]);
}

function unshiftContext(context) {
  this.contexts.unshift(context);
  this.setContext(context);
}

function setup(parentPath, key) {
  this.parentPath = parentPath || this.parentPath;
  this.setKey(key);
}

function setKey(key) {
  this.key = key;
  this.node = this.container[this.key];
  this.type = this.node && this.node.type;
}

function queueNode(path) {
  var _arr2 = this.contexts;

  for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
    var context = _arr2[_i2];
    if (context.queue) {
      context.queue.push(path);
    }
  }
}